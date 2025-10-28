// src/app/api/orders/[id]/route.js
import { NextResponse } from 'next/server';

import { prisma } from 'src/server/db';
import { canonicalize } from 'src/lib/canonical.js';
import { toOrderReadModel } from 'src/lib/serializers/order';

import { buildOrderSnapshot } from '../../stripe/webhook/route';

// import { ALL } from "dns";
// import { select } from "src/theme/core/components/select";

export async function GET(req, { params }) {
  
  const orderId = Number(params.id);
  if (!Number.isFinite(orderId)) {
    return NextResponse.json({ error: 'Invalid order id' }, { status: 400 });
  }

  const url = new URL(req.url);
  
  const canonical = url.searchParams.get('canonical') !== '0';   // default ON
  const includeCents = url.searchParams.get('includeCents') === '1'; // default OFF
  const forceRebuild = url.searchParams.get('forceRebuild') === '1';

  // 1) If we already have a stored snapshot and not forcing rebuild, return it (but canonicalize for stable key order)
  if (!forceRebuild) {
    const snap = await prisma.orderConfirmation.findUnique({
      where: { order_id: orderId },
      select: { payload: true },
    });

    if (snap?.payload) {
      const obj = typeof snap.payload === 'string' ? JSON.parse(snap.payload) : snap.payload;
      const payload = canonical ? canonicalize(obj) : obj;
      return NextResponse.json(payload);
    }
  }

  // 2) Otherwise rebuild the read model from DB
  const dbPayload = await buildOrderSnapshot(prisma, orderId);
  if (!dbPayload) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const readPayload = toOrderReadModel(dbPayload, { canonical: true, includeCents });
  return NextResponse.json(readPayload);
}

// Update enum-driven riceOption 
export async function PATCH(req, { params }) {
  const { id } = params;
  const orderId = Number(id);
  if (!Number.isFinite(orderId)) {
    return NextResponse.json({ error: 'Invalid order id' }, { status: 400 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  // Expecting { riceOption: 'WHITE' | 'BROWN' | 'NO_PREF' }
  const ALLOWED_RICE = new Set(['WHITE', 'BROWN', 'NO_PREF']);
  if (!ALLOWED_RICE.has(body.riceOption)) {
    return NextResponse.json({ error: 'Invalid riceOption.'}, { status: 400 });
  }

  // Persist to prisma enum column
  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { riceOption: body.riceOption },
    select: { id: true, riceOption: true },
  });

  // Return a updated read model
  const dbPayload = await buildOrderSnapshot(prisma, orderId);
  const readPayload = dbPayload ? toOrderReadModel(dbPayload, { canonical: true }) : null;

  return NextResponse.json({
    ok: true,
    orderId: updated.id,
    riceOption: updated.riceOption,
    readModel: readPayload,
  });

}