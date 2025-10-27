// For Admin API: Start an order with confirmed date and session
import { prisma } from 'src/server/db';

import { json, badRequest } from '../../../_lib';

export async function PATCH(req, { params }) {
  const orderId = Number(params.id);
  const { input_date, session } = await req.json();
  if (!input_date || !session) return badRequest('Missing input_date or session');

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      input_type: 'CONFIRMED_DATE',
      input_date: new Date(input_date),
      session,
      status: 'IN_PROGRESS',
    },
  });
  return json(updated);
}
