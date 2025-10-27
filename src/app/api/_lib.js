// src/app/api/_lib.js

import Stripe from 'stripe';
import { NextResponse } from 'next/server';

import { prisma } from '../../server/db';

// ───────────────── Stripe client ─────────────────
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

// ───────────────── JSON helpers ──────────────────
export function json(data, status = 200) {
  return NextResponse.json(data, { status });
}
export function badRequest(msg = 'Bad request') {
  return json({ error: msg }, 400);
}
export function notFound(msg = 'Not found') {
  return json({ error: msg }, 404);
}

// ──────────────── Business rules ─────────────────
export function validatePackageRules({ portion, durationDays, items = [] }) {
  // DUAL → durations 7/14/21/28
  if (portion === 'DUAL' && ![7, 14, 21, 28].includes(durationDays)) {
    throw new Error('Dual: duration must be 7/14/21/28 days.');
  }

  // SINGLE → durations 14/21/28
  if (portion === 'SINGLE' && ![14, 21, 28].includes(durationDays)) {
    throw new Error('Single: duration must be 14/21/28 days.');
  }

  // TRIAL → duration must be 1
  if (portion === 'TRIAL' && durationDays !== 1) {
    throw new Error('Trial must be 1 day.');
  }

  const addonNames = items.map((i) => (i.productName || '').toLowerCase());

  // MyQueen Staycay [TRIAL]
  if (portion === 'TRIAL' && addonNames.some((n) => !n.includes('staycay'))) {
    throw new Error('Trial: only MyQueen Staycay is allowed as add-on.');
  }

  // BMB partner bundle [Dual 28 days]
  const hasBmb = addonNames.some((n) => n.includes('bmb massage'));
  if (hasBmb && !(portion === 'DUAL' && durationDays === 28)) {
    throw new Error('BMB is only available for Dual 28-day package.');
  }
}

// Recomputes subtotal and total after any changes
export function computeTotals({ basePrice, items = [], discountAmount = 0 }) {
  // const itemSum = items.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
  const itemSum = items.reduce((s, i) => s + Number(i?.price ?? 0) * Number(i?.quantity ?? 1), 0);
  const subtotal = Number(basePrice ?? 0) + itemSum;
  const total = Math.max(0, subtotal - Number(discountAmount ?? 0));
  return { subtotal, total };
}

// Recompute amount_paid & is_fully_paid using your enums:
// - charges counted where status === 'PAID'
// - refunds counted where status === 'REFUNDED'
export async function recomputePaid(orderId) {
  const [charges, refunds, ord] = await Promise.all([
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { order_id: orderId, kind: 'CHARGE', status: 'PAID' },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { order_id: orderId, kind: 'REFUND', status: 'REFUNDED' },
    }),
    prisma.order.findUnique({
      where: { id: orderId },
      select: { total: true },
    }),
  ]);

  const chargeSum = Number(charges._sum.amount ?? 0);
  const refundSum = Number(refunds._sum.amount ?? 0);
  const netPaid = Math.max(0, chargeSum - refundSum);
  const orderTotal = Number(ord?.total ?? 0);

  // guard against floating point rounding
  const fullyPaid = orderTotal > 0 ? netPaid + 1e-9 >= orderTotal : false;


  await prisma.order.update({
    where: { id: orderId },
    data: {
      amount_paid: netPaid,
      is_fully_paid: fullyPaid,
    },
  });

  return { netPaid, fullyPaid, orderTotal };
}


// Promo validation sketch
export function assertCanApplyPromotion(order, promo) {
  const now = new Date();
  
  if (promo.starts_at && now < new Date(promo.starts_at)) {
    throw new Error('Promotion not started.');
  }
  
  if (promo.ends_at && now > new Date(promo.ends_at)) {
    throw new Error('Promotion expired.');
  }
  
  if (order.bundleOptionId) {
    throw new Error('Promo code is not applicable when a partner bundle is selected for this order.');
  }
  // Add max_uses or extra_rules checks here as needed
}
