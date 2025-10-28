// Get one (full JSON)
import { NextResponse } from 'next/server';

import { prisma } from 'src/server/db';

export async function GET(_req, { params }) {
  const id = Number(params.orderId);
  const row = await prisma.orderConfirmation.findUnique({ where: { order_id: id } });
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(row);
}
