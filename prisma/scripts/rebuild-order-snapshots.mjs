// prisma/scripts/rebuild-order-snapshots.mjs
// Ensure package.json has "type": "module" OR run: node --experimental-modules ...

import { prisma } from '../../src/server/db.js';                 // << two levels up
import { toOrderReadModel } from '../../src/lib/serializers/order.js';

// To avoid pulling in Next/Stripe deps, we reimplement a minimal snapshot builder here
async function buildOrderSnapshotForScript(prisma, orderId) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      product: true,
      productOption: true,
      items: { include: { product: true, option: true } },
      payment: true,
      appliedPromotions: { include: { promotion: true } },
      delivery: true,
      customer: true,
      requests: { include: { specialRequest: true } },
      notes: true,
    },
  });
  if (!order) return null;

  const charges = order.payment.filter((p) => p.kind === 'CHARGE' && p.status === 'PAID');
  const refunds = order.payment.filter((p) => p.kind === 'REFUND' && p.status === 'PAID');
  const paid =
    charges.reduce((s, p) => s + Number(p.amount), 0) -
    refunds.reduce((s, p) => s + Number(p.amount), 0);
  const total = Number(order.total ?? 0);

  return {
    order: {
      id: order.id,
      status: order.status,
      created_at: order.created_at,
      paymentPlan: order.paymentPlan,
      portion: order.portion,
      session: order.session,
      input_type: order.input_type,
      input_date: order.input_date,
      riceOption: order.riceOption,
      subtotal: order.subtotal,
      total: order.total,
      discount: order.discount,
      gst_amount: order.gst_amount,
    },

    customer: order.customer
      ? {
          id: order.customer.customer_id,
          name: order.customer.name,
          email: order.customer.email,
          phone: order.customer.phone,
          address: order.customer.address,
        }
      : null,

    delivery: order.delivery
      ? {
          full_name: order.delivery.full_name,
          email: order.delivery.email,
          phone: order.delivery.phone,
          address_line: order.delivery.address_line,
          floor: order.delivery.floor,
          unit: order.delivery.unit,
          postal_code: order.delivery.postal_code,
        }
      : null,

    product: {
      product_id: order.product.product_id,
      name: order.product.name,
    },

    productOption: {
      id: order.productOption.id,
      label: order.productOption.label,
      value: order.productOption.value,
      price: Number(order.productOption.price),
    },

    items: order.items.map((i) => ({
      order_item_id: i.order_item_id,
      product_id: i.product_id,
      quantity: i.quantity,
      price: Number(i.price),
      product: { name: i.product.name },
      option: i.option ? { label: i.option.label, value: i.option.value } : null,
    })),

    requests: order.requests
      .filter((r) => {
        const lbl = r.specialRequest?.label || '';
        return !['All White Rice', 'All Brown Rice', 'No Preference'].includes(lbl);
      })
      .map((r) => ({
        id: r.id,
        specialRequestId: r.specialRequestId,
        value: r.value,
        code: r.specialRequest?.value ?? null,
        label: r.specialRequest?.label ?? null,
      })),

    notes: order.notes ?? null,

    appliedPromotions: order.appliedPromotions, // serializer reads fields from nested promotion

    payments: order.payment.map((p) => ({
      id: p.payment_id,
      purpose: p.purpose,
      method: p.method,
      status: p.status,
      amount: Number(p.amount),
      kind: p.kind,
      stripe_session_id: p.stripe_session_id,
      stripe_payment_intent_id: p.stripe_payment_intent_id,
      paid_at: p.paid_at,
      created_at: p.created_at,
    })),

    pricing: {
      subtotal: Number(order.subtotal ?? 0),
      discount: Number(order.discount ?? 0),
      total,
      paid,
      remaining: Math.max(0, total - paid),
    },
  };
}

async function main() {
  const orders = await prisma.order.findMany({ select: { id: true } });

  let ok = 0, fail = 0;
  for (const { id } of orders) {
    try {
      const dbPayload = await buildOrderSnapshotForScript(prisma, id);
      if (!dbPayload) continue;

      // canonical: true so key order matches your API
      const readPayload = toOrderReadModel(dbPayload, { canonical: true });

      await prisma.orderConfirmation.upsert({
        where: { order_id: id },
        update: { payload: readPayload, export_status: 'PENDING', last_error: null, updated_at: new Date() },
        create: { order_id: id, payload: readPayload, export_status: 'PENDING' },
      });

      ok++;
      if (ok % 50 === 0) console.log(`…rebuilt ${ok}/${orders.length}`);
    } catch (e) {
      console.error(`Failed rebuilding order #${id}:`, e);
      fail++;
    }
  }

  console.log(`Done: rebuilt ${ok}/${orders.length}, failed ${fail}`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
