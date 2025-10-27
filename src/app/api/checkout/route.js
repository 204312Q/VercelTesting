// src/app/api/checkout/route.js
export const runtime = 'nodejs';

import Stripe from 'stripe';
import { NextResponse } from 'next/server';

import { prisma } from 'src/server/db';

// Helpers
const round2 = (n) => Math.round(n * 100) / 100;
const GST_RATE_PCT = Number.isFinite(Number(process.env.GST_RATE_PCT))
  ? Number(process.env.GST_RATE_PCT)
  : 9;
const extractInclusiveTax = (totalIncl, ratePct) =>
  round2(totalIncl * (ratePct / (100 + ratePct))); // e.g. 9/109

export const POST = async (req) => {
  try {
    // --- Stripe client ---
    const SECRET = process.env.STRIPE_SECRET_KEY || process.env.NEXT_STRIPE_SECRET_KEY;
    if (!SECRET) {
      return NextResponse.json(
        { error: 'Missing STRIPE_SECRET_KEY in environment' },
        { status: 500 },
      );
    }
    const stripe = new Stripe(SECRET, { apiVersion: '2024-06-20' });

    // --- Input ---
    const body = await req.json();
    const orderId = Number(body.orderId);
    const paymentType = String(body.paymentType || 'FULL').toUpperCase(); // 'PARTIAL' | 'FULL'
    const isPartial = paymentType === 'PARTIAL';
    if (!orderId) return NextResponse.json({ error: 'orderId required' }, { status: 400 });

    // --- Load order from DB ---
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: true, // base product (Dual Meal)
        productOption: true, // duration option (price)
        items: {
          // bundle + add-ons added to order
          include: { product: true, option: true },
        },
        delivery: true,
      },
    });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    // --- Compute totals from DB ---
    const base = Number(order.productOption?.price || 0);
    const extras = (order.items || []).reduce((sum, item) => {
      const qty = Number(item.quantity || 1); // Default quantity = 1
      const price = Number(item.price || 0); // Chosen option already have price
      return sum + price * qty;
    }, 0);
    const discount = Number(order.discount || 0); // 0 if none
    const fullTotal = Math.max(0, base + extras - discount); // Already GST inclusive

    // --- RULE: block partial when base package price < 728 ---
    if (isPartial && base < 728) {
      return NextResponse.json(
        {
          error: 'PARTIAL_NOT_ALLOWED',
          reason: `Base package price (${base}) <= 728`,
        },
        { status: 400 },
      );
    }

    // --- GST calculation part---
    const subtotalIncl = round2(base + extras);   // pre-discount, GST-incl (optional)
    const totalIncl    = round2(fullTotal);       // post-discount, GST-incl
    const gstAmount    = extractInclusiveTax(totalIncl, GST_RATE_PCT);

    await prisma.order.update({
      where: { id: order.id },
        data: {
          subtotal: subtotalIncl.toFixed(2),
          discount: round2(discount).toFixed(2),
          total: totalIncl.toFixed(2),
          gst_amount: gstAmount.toFixed(2),
        },
    });

    // --- Decide payable now ---
    const depositAmount = 100;
    const payable = isPartial ? Math.min(totalIncl, depositAmount) : totalIncl;
    const purpose = isPartial ? 'DEPOSIT' : 'FULL';

    // ✅ Create a pending payment row so the webhook can reconcile later
    const payment = await prisma.payment.create({
      data: {
        order_id: order.id,
        amount: payable, // store in your schema's units (likely dollars)
        status: 'PENDING',
        purpose, // 'DEPOSIT' | 'FULL'
        method: 'STRIPE',  // webhook may override to PayNow if card is chosen
      },
    });

    // --- Build ONE Stripe line item ---
    const line_items = [
      {
        quantity: 1,
        price_data: {
          currency: 'sgd',
          unit_amount: Math.round(payable * 100),
          product_data: {
            name: isPartial
              ? `Deposit for Order #${order.id} – ${order.product?.name ?? 'Package'}`
              : `Order #${order.id} – ${order.product?.name ?? 'Package'}`,
          },
        },
      },
    ];

    const origin = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      payment_method_types: ['card', 'paynow'],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      client_reference_id: String(order.id),
      metadata: {
        orderId: String(order.id),
        paymentId: String(payment.payment_id),
        purpose,
        paymentType,
        fullTotal: String(fullTotal),
        payableNow: String(payable),
      },
    });

    // ✅ Keep session id for webhook fallback
    await prisma.payment.update({
      where: { payment_id: payment.payment_id },
      data: { stripe_session_id: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error in /api/checkout:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
