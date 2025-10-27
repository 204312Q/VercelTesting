// src/app/api/orders/[id]/delivery/route.js
// Upsert Delivery Snapshot

import { prisma } from 'src/server/db';

import { json, badRequest } from '../../../_lib';

// Required fields for delivery
const REQUIRED = ['full_name', 'phone', 'email', 'address_line', 'postal_code'];
const ALLOW_LANDLINE = true; // set to false if you want mobile-only
const MIN_FOR_PARTIAL = 728; // PARTIAL allowed only if price > 728

const normalizePhone = (v) =>
  String(v ?? '')
    .replace(/\D+/g, '')
    .replace(/^65/, ''); // strip non-digits & leading 65
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v ?? ''));
const isSGPostal = (v) => /^\d{6}$/.test(String(v ?? '').trim());
const isSGMobile = (v) => /^(8|9)\d{7}$/.test(v); // 8 or 9 + 7 digits
const isSGLandline = (v) => /^6\d{7}$/.test(v); // 6 + 7 digits
const isSGPhone = (raw) => {
  const n = normalizePhone(raw);
  return ALLOW_LANDLINE ? isSGMobile(n) || isSGLandline(n) : isSGMobile(n);
};

export async function POST(req, { params }) {
  const { id } = await params;
  const orderId = Number(id); 

  let b;
  try {
    b = await req.json();
  } catch {
    return badRequest('Expected JSON body');
  }

  const address_line = (b.address_line ?? b.address)?.toString().trim() ?? null;

  const payload = {
    full_name: b.full_name?.toString().trim() ?? null,
    phone: normalizePhone(b.phone),
    email: b.email?.toString().trim() ?? null,
    address_line,
    floor: b.floor?.toString().trim() || null,
    unit: b.unit?.toString().trim() || null,
    postal_code: b.postal_code?.toString().trim() ?? null,
  };

  // Validate
  const errors = {};
  for (const k of REQUIRED) if (!payload[k]) errors[k] = 'Required';

  if (payload.full_name && payload.full_name.length < 2) errors.full_name = 'Too short';
  if (payload.email && !isEmail(payload.email)) errors.email = 'Invalid email';
  if (b.phone && !isSGPhone(b.phone)) {
    errors.phone = ALLOW_LANDLINE
      ? 'Invalid SG number (allowed: 6/8/9 + 7 digits, with optional +65)'
      : 'Invalid SG mobile (8/9 + 7 digits, with optional +65)';
  }
  if (payload.postal_code && !isSGPostal(payload.postal_code)) {
    errors.postal_code = 'Invalid SG postal code (6 digits)';
  }

  if (Object.keys(errors).length) {
    return badRequest({ error: 'Invalid delivery details', errors });
  }

  // Load order with productOption price
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      productOption: { select: { price: true } },
    },
  });
  if (!order) return badRequest('Order not found');

  const optionPrice = Number(order.productOption?.price ?? 0);
  const postedPlan = b.paymentPlan ? String(b.paymentPlan).trim().toUpperCase() : null;

  if (postedPlan) {
    if (!['FULL', 'PARTIAL'].includes(postedPlan)) {
      return badRequest('Invalid paymentPlan. Use "FULL" or "PARTIAL".');
    }
  }

  let effectivePlan = postedPlan ?? order.paymentPlan ?? 'FULL';

  // Enforce rule: disallow PARTIAL when price < 728
  if (effectivePlan === 'PARTIAL' && optionPrice < MIN_FOR_PARTIAL) {
    return badRequest({
      error: 'PARTIAL payment not allowed for this order',
      reason: `Option price (${optionPrice}) < ${MIN_FOR_PARTIAL}`,
      code: 'PARTIAL_NOT_ALLOWED',
    });
  }

  // Upsert delivery snapshot
  const delivery = await prisma.orderDelivery.upsert({
    where: { orderId },
    create: { orderId, ...payload },
    update: { ...payload },
  });

  // Updated for payment plan
  if (b.paymentPlan) {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentPlan: b.paymentPlan },
    });
  }

  return json({ delivery, paymentPlan: b.paymentPlan ?? null });
}
