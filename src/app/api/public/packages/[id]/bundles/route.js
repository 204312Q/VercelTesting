export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

import { prisma } from 'src/server/db';

export async function GET(req, { params: paramsPromise }) {
  const { id } = await paramsPromise;
  const productId = Number(id);
  const { searchParams } = new URL(req.url);
  const duration = Number(searchParams.get('duration'));

  if (!Number.isFinite(productId)) {
    return NextResponse.json({ message: 'Invalid id' }, { status: 400 });
  }

  const where = {
    productId,
    type: 'PARTNER_BUNDLE',
    ...(Number.isFinite(duration) ? { value: duration } : {}),
  };

  const rows = await prisma.productOption.findMany({
    where,
    orderBy: { id: 'asc' },
    select: { id: true, label: true, price: true },
  });

  const bundles = rows.map(r => ({
    product_id: r.id,
    name: r.label,
    price: r.price == null ? 0 : Number(r.price),
  }));

  return NextResponse.json(bundles);
}
