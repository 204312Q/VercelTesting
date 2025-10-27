// Enqueue actions (email/export/retry)
import { NextResponse } from 'next/server';

import { prisma } from 'src/server/db';
// import { enqueueDynamicsExport } from '@/lib/queues/exports'; // implement with BullMQ/etc.

export async function POST(_req, { params }) {
  const orderId = Number(params.orderId);
  const oc = await prisma.orderConfirmation.findUnique({ where: { order_id: orderId } });
  if (!oc) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.orderConfirmation.update({
    where: { order_id: orderId },
    data: { export_status: 'QUEUED', export_attempts: { increment: 1 }, last_error: null }
  });

  // await enqueueDynamicsExport(orderId); // fire-and-forget
  return NextResponse.json({ ok: true });
}
