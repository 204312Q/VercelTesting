// src/lib/serializers/order.js

import { canonicalize } from '../canonical.js';
import { toCents, moneyOut } from '../money.js';

const isoDate = (d) => (d ? new Date(d).toISOString() : null);

// Read from .env, default to 9 if unset/invalid
const GST_RATE_PCT = (() => {
  const v = Number(process.env.GST_RATE_PCT);
  return Number.isFinite(v) ? v : 9;
})();

const deriveInclusiveGstCents = (totalCents) =>
  Math.round((totalCents * GST_RATE_PCT) / (100 + GST_RATE_PCT));

export function toOrderReadModel(db, opts = {}) {
  if (!db) return null;
  const { canonical = false, includeCents = false } = opts;

  // payments summary (in cents)
  const charges = (db.payments || []).filter((p) => p.kind === 'CHARGE' && p.status === 'PAID');
  const refunds = (db.payments || []).filter((p) => p.kind === 'REFUND' && p.status === 'PAID');
  const paidCents =
    charges.reduce((s, p) => s + toCents(p.amount), 0) -
    refunds.reduce((s, p) => s + toCents(p.amount), 0);

  let subtotalCents = toCents(db.order?.subtotal ?? 0);
  let totalCents = toCents(db.order?.total ?? 0);
  const gstAmountCentsDb = toCents(db.order?.gst_amount ?? 0);

  // Derive subtotal/total from items/promos if DB values are zero/missing (for older orders or alternate checkout flows)
  if (subtotalCents === 0 || totalCents === 0) {
    const baseCents = db.productOption ? toCents(db.productOption.price) : 0;
    const extrasCents = (db.items || []).reduce((sum, i) => {
      const unit = toCents(i.price ?? 0);
      const qty = Number(i.quantity || 1);
      return sum + unit * qty;
      // // Prefer line_total if present; fallback to unit_price * quantity
      // const lineCents = toCents(i.line_total ?? 0);
      // if (lineCents) return sum + lineCents;
      // const unitCents = toCents(i.unit_price ?? 0);
      // const qty = Number(i.quantity || 1);
      // return sum + unitCents * qty;
    }, 0);
    const discountCents = (db.promotions || []).reduce(
      (s, p) => s + toCents(p.amount_applied ?? 0),
      0,
    );
    const derivedSubtotal = baseCents + extrasCents;
    const derivedTotal = Math.max(0, derivedSubtotal - discountCents);
    if (subtotalCents === 0) subtotalCents = derivedSubtotal;
    if (totalCents === 0) totalCents = derivedTotal;
  }

  const gstAmountCents =
    gstAmountCentsDb || (totalCents > 0 ? deriveInclusiveGstCents(totalCents) : 0);

  const remainingCents = Math.max(0, totalCents - paidCents);

  // package line item
  const pkgItem =
    db.product && db.productOption
      ? [
          {
            productId: db.product.product_id, // 1:DUAL|2:SINGLE|3:TRIAL
            productName: db.product.name, //"Dual Meal" | "Single Meal" | "Trial Meal"
            kind: 'PACKAGE', // If pkgItem, fixed to "PACKAGE"
            quantity: 1, // Always 1 for package
            id: `pkg-${db.productOption.id}`, //"pkg-" + product_option.id (Package ranging from 1 to 10)
            option: { label: db.productOption.label, value: db.productOption.value }, // Label: Choice, Value: duration
            lineTotalCents: toCents(db.productOption.price), // Same as unitPriceCents since qty=1
            unitPriceCents: toCents(db.productOption.price), // Keeps for later usage on BC
          },
        ]
      : [];
  // add-ons
  const addonItems = (db.items || []).map((i) => ({
    id: i.order_item_id, // Auto increment ID based on the OrderItem table
    productId: i.product_id, // Product ID from Product table ()
    productName: i.product?.name ?? '', // 4:PigTrotter|5:PapayaSoup|6:BirdNest|7:ComfortSet|8:ThermalFlask
    kind: 'ADDON',
    quantity: i.quantity, // As price already fixed for different quantity, so will always be 1
    option: i.option ? { label: i.option.label, value: i.option.value } : null,
    unitPriceCents: toCents(i.price || 0), // Keeps for later usage on BC
    lineTotalCents: toCents((Number(i.price) || 0) * (Number(i.quantity) || 1)), // Same as unitPriceCents since qty=1
  }));

  // bring special requests + note into the read model
  const requests = (db.requests || []).map((r) => ({
    id: r.id,
    code: r.code ?? null, // from snapshot builder
    label: r.label ?? null,
    value: !!r.value,
    specialRequestId: r.specialRequestId,
  }));

  const note = db.notes?.text ?? null;

  // build in desired order
  const order = {
    id: db.order.id,
    createdAt: isoDate(db.order.created_at),
    inputType: db.order.input_type,
    serviceDate: db.order.input_date ? isoDate(db.order.input_date).slice(0, 10) : null,
    portion: db.order.portion,
    session: db.order.session ?? null,
    riceOption: db.order.riceOption ?? 'NO_PREF',
    status: db.order.status,
    paymentPlan: db.order.paymentPlan,

    lineItems: [...pkgItem, ...addonItems],

    requests,

    note,

    payments: (db.payments || []).map((p) => ({
      id: p.payment_id,
      kind: p.kind,
      purpose: p.purpose,
      method: p.method,
      status: p.status,
      amount: moneyOut(toCents(p.amount)),
      createdAt: isoDate(p.created_at),
      paidAt: isoDate(p.paid_at),
      stripe: {
        paymentIntentId: p.stripe_payment_intent_id || null,
        checkoutSessionId: p.stripe_session_id || null,
      },
    })),

    pricing: {
      currency: 'SGD',
      subtotal: moneyOut(subtotalCents),
      paid: moneyOut(paidCents),
      total: moneyOut(totalCents),
      remaining: moneyOut(remainingCents),
      gstAmount: moneyOut(gstAmountCents),
      discounts: (db.appliedPromotions || []).map((p) => ({
        code: p.promotion?.promotion_code,
        type: p.promotion?.discount_type,
        value: Number(p.promotion?.discount_value),
        amount: moneyOut(toCents(p.discount_amount)),
      })),
    },

    promotions: (db.appliedPromotions || []).map((p) => ({
      code: p.promotion?.promotion_code,
      type: p.promotion?.discount_type,
      value: Number(p.promotion?.discount_value),
      amount: moneyOut(toCents(p.discount_amount)),
    })),

    delivery: db.delivery
      ? {
          unit: db.delivery.unit,
          email: db.delivery.email,
          floor: db.delivery.floor,
          phone: db.delivery.phone,
          fullName: db.delivery.full_name,
          postalCode: db.delivery.postal_code,
          addressLine: db.delivery.address_line,
        }
      : null,

    customer: db.customer
      ? {
          id: db.customer.customer_id,
          name: db.customer.name,
          email: db.customer.email,
          phone: db.customer.phone,
        }
      : null,
  };

  // Strip {amount,cents,display} -> "36.10" (or "S$36.10" if you prefer) when includeCents=false
  const stripMoney = (obj) => {
    if (Array.isArray(obj)) return obj.map(stripMoney);
    if (obj && typeof obj === 'object') {
      // money object detection
      if ('amount' in obj && 'cents' in obj && 'display' in obj) {
        // return obj.display to emit "S$36.10" instead of "36.10"
        return obj.amount;
      }
      const out = {};
      for (const [k, v] of Object.entries(obj)) out[k] = stripMoney(v);
      return out;
    }
    return obj;
  };

  let payload = { version: '1.1', order: includeCents ? order : stripMoney(order) };
  if (canonical) payload = canonicalize(payload); // enforce key order if desired
  return payload;
}
