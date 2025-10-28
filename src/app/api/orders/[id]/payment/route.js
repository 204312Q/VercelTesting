// app/api/orders/[id]/payment/route.js
import { prisma } from 'src/server/db';

import { json, stripe, badRequest } from '../../../_lib';

const round2 = (n) => Math.round(Number(n) * 100) / 100;

export async function POST(req, { params }) {
  const { id } = await params;
  const orderId = Number(id); 
  let { plan, deposit } = await req.json();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { productOption: true, delivery: true },
  });
  if (!order) return badRequest('Order not found');

  // Default to order.paymentPlan if not provided
  plan = (plan || order.paymentPlan || 'FULL').toUpperCase();
  if (!['FULL', 'PARTIAL'].includes(plan)) {
    return badRequest('Invalid plan. Use FULL or PARTIAL.');
  }

  if (!order?.total) return badRequest('Order has no total');
  if (!order?.productOption) return badRequest('Order is missing product option details');


  // Block partial payments if productOption seleted price < 728
  if (plan === 'PARTIAL' && order.productOption.price < 728) {
    return badRequest('Partial payment is not allowed for orders priced below $728.');
  }

  // Check how much has been paid already
  const paidSoFar = await prisma.payment.aggregate({
    where: { order_id: orderId, status: 'PAID' },
    _sum: { amount: true },
  });
  const alreadyPaid = Number(paidSoFar._sum.amount || 0);

  const total = Number(order.total || 0);

  let amountNow;
  let purpose; // FULL | DEPOSIT | BALANCE

  
  if (plan === 'PARTIAL' && alreadyPaid === 0) {
    // First partial charge → deposit
    amountNow = Number(deposit || 100);
    purpose = 'DEPOSIT';

  } else if (plan === 'PARTIAL' && alreadyPaid > 0) { 
    // Subsequent partial charge → balance
    amountNow = round2(total - alreadyPaid);
    if (amountNow <= 0) return badRequest('No outstanding balance to collect.');
    purpose = 'BALANCE';

  } else { // FULL plan = one-time payment
    amountNow = round2(total);
    purpose = 'FULL';
  }

  const amountCents = Math.round(amountNow * 100);
  if (amountCents <= 0) return badRequest('Charge amount must be greater than 0.');

  // 1) Create pending Payment
  const payment = await prisma.payment.create({
    data: {
      order_id: orderId,
      method: 'STRIPE',
      purpose,        // FULL | DEPOSIT | BALANCE
      kind: 'CHARGE',
      status: 'PENDING',
      amount: amountNow,
    },
  });

  // 2) Stripe Checkout Session
  const origin = process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card', 'paynow'], // show both if enabled
    line_items: [
      {
        price_data: {
          currency: 'sgd',
          product_data: { name: `Order #${orderId} - ${purpose}` },
          unit_amount: amountCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/checkout/success?order=${orderId}&p=${payment.payment_id}`,
    cancel_url: `${origin}/checkout/cancel?order=${orderId}&p=${payment.payment_id}`,
    
    // ✅ Add metadata to BOTH Session and the underlying PaymentIntent:
    metadata: {
      orderId: String(orderId),
      paymentId: String(payment.payment_id),
      plan,
      purpose,
    },
    // Ensure if payment fails, it goes to the PaymentIntent
    payment_intent_data: {
      metadata: {
        orderId: String(orderId),
        paymentId: String(payment.payment_id),
        plan,
        purpose,
      },
    },
  });

  await prisma.payment.update({
    where: { payment_id: payment.payment_id },
    data: { stripe_session_id: session.id },
  });
  return json({ sessionUrl: session.url });
}
