// For Admin API: Acknowledge an order
import { prisma } from 'src/server/db';

import { json } from '../../../_lib';

export async function PATCH(_req, { params }) {
  const orderId = Number(params.id);
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: 'FULFILLED' },
  });
  return json(updated);
}
