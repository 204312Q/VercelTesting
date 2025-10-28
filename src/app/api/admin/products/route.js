//GET /api/admin/products

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

import { prisma } from 'src/server/db';

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { product_id: 'asc' },
    select: {
      product_id: true,
      name: true,
      type: true,
      price: true,
      visible: true,
      imageUrl: true,
      imagePublicId: true,
    },
  });
  return NextResponse.json(products);
}
