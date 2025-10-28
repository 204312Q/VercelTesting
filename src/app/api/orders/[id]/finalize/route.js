// api/orders/[id]/finalize/route.js
import { prisma } from 'src/server/db';

import { json, badRequest } from '../../../_lib';

export async function POST(_req, { params }) {
  const orderId = Number(params.id);

  //1# Verify at least one suceeded payment exists
  const paid = await prisma.payment.findFirst({
    where: { order_id: orderId, kind: 'CHARGE', status: 'PAID' },
  });
  if (!paid) return badRequest('Payment not completed');

  //2# Get order + delivery snapshot
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { delivery: true },
  });
  if (!order?.delivery) return badRequest('Missing delivery snapshot');

  const d = order.delivery;
  //3# Safely build full address (trim + remove empty)
  const addressFull = [d.address_line, d.floor, d.unit]
    .map(v => v?.trim()) // remove leading/trailing spaces
    .filter(Boolean)     // remove null, undefined, empty
    .join(', ');

  //4# Create or update customer
  const customer = await prisma.customer.upsert({
    where: { email: d.email }, // or by phone
    update: { name: d.full_name.trim(), phone: d.phone.trim(), address: addressFull },
    create: {
      name: d.full_name.trim(),
      email: d.email.trim(),
      phone: d.phone.trim(),
      address: addressFull,
      marketing_opt_in: false,
    },
  });

  //5# Link customer to order
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { customerId: customer.customer_id },
  });

  return json(updated);
}
