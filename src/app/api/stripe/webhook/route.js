// src/app/api/stripe/webhook/route.js
import { prisma } from 'src/server/db';
import { toOrderReadModel } from 'src/lib/serializers/order';

import { json, stripe, badRequest, recomputePaid } from '../../_lib';

function mapStripePmToEnum(method) {
  // adjust to your enum values; you currently store "STRIPE".
  // If you later add CARD/PAYNOW etc., switch here.
  switch (method) {
    case 'paynow':
      return 'PAYNOW';
    case 'card':
      return 'STRIPE';
    default:
      return 'STRIPE';
  }
}

// Try to figure out which method was used
async function inferEnumMethodFromStripe(stripeClient, sessionOrPI) {
  // If we received a Checkout Session, get the PaymentIntent id
  let piId = null;

  // Extract Payment Intent ID if given a checkout session
  if (sessionOrPI?.object === 'checkout.session') {
    piId =
      typeof sessionOrPI.payment_intent === 'string'
        ? sessionOrPI.payment_intent
        : sessionOrPI.payment_intent?.id;
  } else if (sessionOrPI?.object === 'payment_intent') {
    piId = sessionOrPI.id;
  }
  if (!piId) return 'STRIPE';

  // Expand the PI to read payment method details
  const pi = await stripeClient.paymentIntents.retrieve(piId, {
    expand: [
      // 'payment_method',
      // 'latest_charge.payment_method_details',
      'charges.data.payment_method_details',
    ],
  });
  const charge = pi.charges?.data?.[0];
  const stripeType =
    charge?.payment_method_details?.type ||
    (Array.isArray(pi.payment_method_types) ? pi.payment_method_types[0] : null);

  return mapStripePmToEnum(stripeType || 'card');
}

// Create or link a Customer from Order.delivery and attach it to the order
async function ensureCustomerForOrder(db, orderId) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { customer: true, delivery: true },
  });
  if (!order || order.customer) return order?.customer ?? null;

  const d = order.delivery;
  if (!d) {
    console.warn('[webhook] ensureCustomerForOrder: no delivery snapshot for order', orderId);
    return null; // safety
  }

  // dedupe by email (fallback to phone if needed)
  const existing =
    (d.email && (await db.customer.findUnique({ where: { email: d.email } }))) ||
    (d.phone && (await db.customer.findUnique({ where: { phone: d.phone } })));

  const customer =
    existing ??
    (await db.customer.create({
      data: {
        name: d.full_name,
        email: d.email,
        phone: d.phone,
        address: d.address_line,
        marketing_opt_in: false, // or infer from UI
      },
    }));

  await db.order.update({
    where: { id: orderId },
    data: { customerId: customer.customer_id },
  });

  return customer;
}

export async function buildOrderSnapshot(db, orderId) {
  const order = await db.order.findUnique({
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

    customer: order.customer ? {
          id: order.customer.customer_id,
          name: order.customer.name,
          email: order.customer.email,
          phone: order.customer.phone,
          address: order.customer.address,
        } : null,

    delivery: order.delivery ? {
          full_name: order.delivery.full_name,
          email: order.delivery.email,
          phone: order.delivery.phone,
          address_line: order.delivery.address_line,
          floor: order.delivery.floor,
          unit: order.delivery.unit,
          postal_code: order.delivery.postal_code,
        } : null,

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

    // Ensure Rice options are excluded from the snapshot
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

    appliedPromotions: order.appliedPromotions,

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
    }
  }
}

export async function POST(req) {
  // -------------------- Local test helper --------------------
  const testMode = req.headers.get('x-test-stripe');
  if (process.env.NODE_ENV === 'development' && testMode) {
    const { orderId, paymentId, status, purpose} = await req.json();

    await prisma.payment.update({
      where: { payment_id: paymentId },
      data: {
        status, // 'PAID' OR 'FAILED'
        paid_at: status === 'PAID' ? new Date() : null,
      },
    });

    if (status === 'PAID') {
      console.log(`✅ Test payment successful for ${purpose}`);
      await recomputePaid(orderId);
    } else {
      console.log(`❌ Test payment FAILED for ${purpose}`);
    }
    return json({ test: true, status, purpose });
  }

  // ---------- Real Stripe webhook ----------
  const sig = req.headers.get('stripe-signature');
  const rawBody = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return badRequest(`Webhook error: ${err.message}`);
  }

  switch (event.type) {
    // --------------------------------------------------------------------------------
    // -------------------------------- SUCCESS BRANCH --------------------------------
    // --------------------------------------------------------------------------------
    case 'checkout.session.completed': {
      const s = event.data.object;

      // Re-read the session with expansions so metadata & PI are definitely present
      const session = await stripe.checkout.sessions.retrieve(s.id, { expand: ['payment_intent'] });
      const orderId = Number(session.metadata?.orderId);
      const paymentId = Number(session.metadata?.paymentId);
      const enumMethod = await inferEnumMethodFromStripe(stripe, session);
      const piId =
        typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id;

      // 1) by payment_id
      let updated = await prisma.payment.updateMany({
        where: { payment_id: paymentId || -1 },
        data: {
          status: 'PAID', // Enum
          method: enumMethod, // STRIPE or PAYNOW
          stripe_payment_intent_id: piId || null,
          paid_at: new Date(),
        },
      });

      // 2) fallback by session id
      if (updated.count === 0) {
        updated = await prisma.payment.updateMany({
          where: { stripe_session_id: session.id },
          data: {
            status: 'PAID', // Enum
            method: enumMethod,
            stripe_payment_intent_id: piId || null,
            paid_at: new Date(),
          },
        });
      }
      // Create/link Customer and attach to order
      if (orderId) await ensureCustomerForOrder(prisma, orderId);

      const dbPayload = await buildOrderSnapshot(prisma, orderId);
      if (dbPayload) {
        const readPayload = toOrderReadModel(dbPayload);

        await prisma.orderConfirmation.upsert({
          where: { order_id: orderId },
          update: { payload: readPayload, export_status: 'PENDING', last_error: null },
          create: { order_id: orderId, payload: readPayload, export_status: 'PENDING' },
        });

        // void sendOrderConfirmationEmail(payload);
        // void enqueueDynamicsSync(orderId); // sets export_status late
      }

      // Recompute order.amount_paid & is_fully_paid
      if (orderId) await recomputePaid(orderId);
      break;
    }

    case 'checkout.session.async_payment_succeeded': {
      const s = event.data.object;
      const enumMethod = await inferEnumMethodFromStripe(stripe, s);
      await prisma.payment.updateMany({
        where: { payment_id: Number(s.metadata?.paymentId) || -1 },
        data: {
          status: 'PAID',
          method: enumMethod,
          stripe_session_id: s.id,
          stripe_payment_intent_id:
            typeof s.payment_intent === 'string' ? s.payment_intent : s.payment_intent?.id,
          paid_at: new Date(),
        },
      });

      const orderId = Number(s.metadata?.orderId);

      if (orderId) await ensureCustomerForOrder(prisma, orderId);

      // build + upsert snapshot
      if (orderId) {
        const dbPayload = await buildOrderSnapshot(prisma, orderId);
        if (dbPayload) {
          const readPayload = toOrderReadModel(dbPayload);

          await prisma.orderConfirmation.upsert({
            where: { order_id: orderId },
            update: { payload: readPayload, export_status: 'PENDING', last_error: null },
            create: { order_id: orderId, payload: readPayload, export_status: 'PENDING' },
          });

          // void sendOrderConfirmationEmail(payload);
          // void enqueueDynamicsSync(orderId); // sets export_status late
        }
      }

      if (orderId) await recomputePaid(orderId);
      break;
    }

    // --------------------------------------------------------------------------------
    // -------------------------------- FAILURE BRANCH --------------------------------
    // --------------------------------------------------------------------------------
    case 'payment_intent.payment_failed': {
      const pi = event.data.object;

      // 1) Preferred mapping via PI metadata
      let orderId = Number(pi.metadata?.orderId);
      let paymentId = Number(pi.metadata?.paymentId);
      // const purpose = pi.metadata?.purpose;

      // 2) Fallback: look up the Checkout Session by PI to get session.id & metadata
      let session;
      if (!orderId || !paymentId) {
        const list = await stripe.checkout.sessions.list({ payment_intent: pi.id, limit: 1 });
        session = list.data?.[0];
        orderId ||= Number(session?.metadata?.orderId ?? session?.client_reference_id);
        paymentId ||= Number(session?.metadata?.paymentId);
      }

      // 3) Try update by payment_id (may be stale if user used an old session)
      let updated = await prisma.payment.updateMany({
        where: { payment_id: paymentId || -1 },
        data: {
          status: 'FAILED',
          stripe_payment_intent_id: pi.id,
          paid_at: null,
        },
      });

      // 4) Fallback: update by session id (when metadata paymentId was missing or stale)
      if (updated.count === 0 && session?.id) {
        updated = await prisma.payment.updateMany({
          where: { stripe_session_id: session.id },
          data: {
            status: 'FAILED',
            stripe_payment_intent_id: pi.id,
            paid_at: null,
          },
        });
      }

      // 5) Last resort: the latest PENDING payment for this order
      if (updated.count === 0 && orderId) {
        const pending = await prisma.payment.findFirst({
          where: { order_id: orderId, status: 'PENDING' },
          orderBy: { payment_id: 'desc' },
        });
        if (pending) {
          await prisma.payment.update({
            where: { payment_id: pending.payment_id },
            data: {
              status: 'FAILED',
              stripe_payment_intent_id: pi.id,
              paid_at: null,
            },
          });
          updated.count = 1;
        }
      }

      if (updated.count === 0) {
        console.warn('Could not map failed PI to a Payment row', {
          pi: pi.id,
          orderId,
          paymentId,
          sessionId: session?.id,
        });
      } else {
        console.log(
          `❌ Marked payment FAILED (order #${orderId ?? '?'}, payment #${paymentId ?? '?'})`,
          pi.last_payment_error?.code,
          pi.last_payment_error?.decline_code,
        );
      }
      break;
    }

    // Async methods (FPX, Bank Debits, etc.) failing after the session
    case 'checkout.session.async_payment_failed': {
      const s = event.data.object;
      const orderId = Number(s.metadata?.orderId); //Optional
      const paymentId = Number(s.metadata?.paymentId);

      // Primary: match by payment_id (and also order_id if present, as a sanity check)
      let updated = await prisma.payment.updateMany({
        where: {
          payment_id: paymentId || -1,
          ...(orderId ? { order_id: orderId } : {}),
        },
        data: {
          status: 'FAILED',
          stripe_payment_intent_id:
            typeof s.payment_intent === 'string' ? s.payment_intent : s.payment_intent?.id,
          paid_at: null,
        },
      });

      // Fallback 1: match the Checkout Session id (covers stale/missing paymentId)
      if (updated.count === 0) {
        updated = await prisma.payment.updateMany({
          where: { stripe_session_id: s.id },
          data: {
            status: 'FAILED',
            stripe_payment_intent_id:
              typeof s.payment_intent === 'string' ? s.payment_intent : s.payment_intent?.id,
            paid_at: null,
          },
        });
      }

      // Fallback 2: last PENDING payment for this order
      if (updated.count === 0 && orderId) {
        const pending = await prisma.payment.findFirst({
          where: { order_id: orderId, status: 'PENDING' },
          orderBy: { payment_id: 'desc' },
        });
        if (pending) {
          await prisma.payment.update({
            where: { payment_id: pending.payment_id },
            data: {
              status: 'FAILED',
              stripe_payment_intent_id:
                typeof s.payment_intent === 'string' ? s.payment_intent : s.payment_intent?.id,
              paid_at: null,
            },
          });
        }
      }
      break;
    }

    // Optional: treat expired checkout as a failure/cancel
    case 'checkout.session.expired': {
      const s = event.data.object;
      const orderId = Number(s.metadata?.orderId);
      const paymentId = Number(s.metadata?.paymentId);
      let updated = await prisma.payment.updateMany({
        where: {
          payment_id: paymentId || -1,
          ...(orderId ? { order_id: orderId } : {}),
        },
        data: { status: 'FAILED', paid_at: null },
      });

      if (updated.count === 0) {
        await prisma.payment.updateMany({
          where: { stripe_session_id: s.id },
          data: { status: 'FAILED', paid_at: null },
        });
      }
      break;
    }

    default:
      // no-op
      break;
  }

  // Do Later ------------------ Handle refund events ------------------

  return json({ received: true });
}
