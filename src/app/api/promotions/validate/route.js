export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

import { prisma } from 'src/server/db';

export async function POST(req) {
  try {
    const { code, subtotal } = await req.json();
    if (!code) {
      return NextResponse.json({ valid: false, error: 'Missing code' }, { status: 400 });
    }

    const promo = await prisma.promotion.findUnique({
      where: { promotion_code: code.toUpperCase() },
    });
    if (!promo) {
      return NextResponse.json({ valid: false, error: 'Invalid promo code' }, { status: 200 });
    }

    const sub = Number(subtotal || 0);
    const value = Number(promo.discount_value || 0);
    let discountAmount = 0;

    if (promo.discount_type === 'PERCENT') {
      discountAmount = +((sub * value) / 100).toFixed(2);
    } else {
      discountAmount = +value.toFixed(2);
    }

    return NextResponse.json({
      valid: true,
      promo: {
        id: promo.promotion_id,
        code: promo.promotion_code,
        type: promo.discount_type, // 'PERCENT' | 'FIXED'
        value: promo.discount_value,
      },
      discountAmount,
    });
  } catch (e) {
    console.error('[PROMO_VALIDATE]', e);
    return NextResponse.json({ valid: false, error: 'Validation failed' }, { status: 500 });
  }
}
