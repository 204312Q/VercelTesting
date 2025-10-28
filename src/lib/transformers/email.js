// src/lib/transformers/email.js

const centsTo = (c) => (Number(c ?? 0) / 100).toFixed(2);

/**
 * Map the read model into a simple email view-model that your template can render.
 * @param {object} read - result of toOrderReadModel(...)
 */
export function toEmailModel(read) {
  const o = read?.order ?? {};
  return {
    orderNumber: o.id,
    placedAtIso: o.createdAt,
    serviceDate: o.serviceDate,
    customer: {
      name: o.customer?.name || '',
      email: o.customer?.email || '',
      phone: o.customer?.phone || '',
    },
    delivery: o.delivery || null,
    items: (o.lineItems || []).map(li => ({
      name: li.productName,
      option: li.option?.label ?? null,
      qty: li.quantity,
      unit: centsTo(li.unitPriceCents),
      total: centsTo(li.lineTotalCents),
    })),
    totals: {
      subtotal: centsTo(o.pricing?.subtotalCents),
      discounts: (o.pricing?.discounts || []).map(d => ({
        code: d.code, amount: centsTo(d.amountCents)
      })),
      paid: centsTo(o.pricing?.paidCents),
      total: centsTo(o.pricing?.totalCents),
      remaining: centsTo(o.pricing?.remainingCents),
      currency: o.pricing?.currency || 'SGD',
    }
  };
}
