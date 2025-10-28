// src/app/api/orders/[id]/promotions/route.js
// Order Flow - Apply Promotion
import { Prisma } from '@prisma/client';

import { prisma } from 'src/server/db';

import { json, badRequest, computeTotals, assertCanApplyPromotion } from '../../../_lib';

const D = Prisma.Decimal;
const money = (x) => new D(x ?? 0).toDecimalPlaces(2, D.ROUND_HALF_UP);

export async function POST(req, { params }) {
  const { id } = params;
  const orderId = Number(id); 
  const { code } = await req.json();
  const normalized = String(code || '').trim().toUpperCase();
  if (!normalized) return badRequest('Missing code');
  

  const [order, promo, items] = await Promise.all([
    prisma.order.findUnique({
      where: { id: orderId },
      include: { productOption: true },
    }),
    prisma.promotion.findUnique({ where: { promotion_code: normalized } }),
    prisma.orderItem.findMany({ where: { orderId } }),
  ]);
  if (!order || !promo) return badRequest('Invalid order or promo');

  // 🚫 Block promotions when a partner bundle is present on the order
  if (order.bundleOptionId) {
    return badRequest('Promo code is not applicable when a partner bundle is selected for this order.');
  }

  try {
    assertCanApplyPromotion(order, promo);
  } catch (e) {
    return badRequest(e.message);
  }

  // Calculate subtotal with 2dp
  const { subtotal } = computeTotals({
    basePrice: Number(order.productOption?.price ?? 0),
    items,
    discountAmount: 0,
  });

  const subtotalD = money(subtotal);

  const raw = new D(promo.discount ?? promo.discount_value ?? 0);
  let discountD = 
    promo.discount_type === 'PERCENT'
      ? subtotalD.mul(raw).div(100)
      : raw;

  if (discountD.isNegative()) discountD = new D(0);
  if (discountD.greaterThan(subtotalD)) discountD = subtotalD;
  discountD = discountD.toDecimalPlaces(2, D.ROUND_HALF_UP);

  let totalD = subtotalD.minus(discountD);
  if (totalD.isNegative()) totalD = new D(0);
  totalD = totalD.toDecimalPlaces(2, D.ROUND_HALF_UP);

  await prisma.appliedOrderPromotion.upsert({
    where: { order_id: orderId },
    create: {
      order_id: orderId,
      promotion_id: promo.promotion_id,
      discount_amount: discountD,
      applied_by: 'system',
    },
    update: { promotion_id: promo.promotion_id, discount_amount: discountD },
  });

  // const total = Math.max(0, Math.round((Number(subtotal) - Number(applied.discount_amount)) *100) / 100);
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { 
      subtotal: subtotalD, 
      discount: discountD, 
      total: totalD 
    },
  });

  return json({ ok: true, order: updated, promo: { code: promo.promotion_code } });
}
