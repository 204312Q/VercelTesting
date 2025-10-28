// src/app/api/orders/[id]/requests/route.js
import { prisma } from 'src/server/db';

import { json, badRequest } from '../../../_lib';


export async function POST(req, { params }) {
  const { id } = params;
  const orderId = Number(id); 
  let body;

  try {
    body = await req.json();
  } catch {
    return badRequest('Expected JSON body');
  }

  // ✅ Normalize incoming payload
  const incoming = Array.isArray(body.requests) ? body.requests : [];
  const requests = incoming
    .filter(r => r && r.specialRequestId != null)
    .map(r => ({
      specialRequestId: Number(r.specialRequestId),
      value: !!r.value,
    }));

  const noteText =
    typeof body.note === 'string'
      ? body.note.trim()
      : body.note != null
      ? String(body.note).trim()
      : null;

  // Allowed IDs (numbers)
  const allowedIds = (
    await prisma.specialRequest.findMany({ select: { id: true }, where: { active: true } })
  ).map((r) => r.id);

  const invalidIds = requests
    .map((r) => r.specialRequestId)
    .filter((reqid) => !allowedIds.includes(reqid));

  if (invalidIds.length) {
    return badRequest({ error: `Invalid specialRequestId(s): ${invalidIds.join(', ')}` });
  }

  await prisma.$transaction(async (tx) => {
    // Handle requests
    for (const r of requests) {
      if (r.value) {
        await tx.orderRequest.upsert({
          where: { orderId_specialRequestId: { orderId, specialRequestId: r.specialRequestId } },
          create: { orderId, specialRequestId: r.specialRequestId, value: true },
          update: { value: true },
        });
      } else {
        await tx.orderRequest.deleteMany({
          where: { orderId, specialRequestId: r.specialRequestId },
        });
      }
    }

    // Handle note
    if (noteText !== null) {
      if (noteText === '') {
        await tx.orderNote.deleteMany({ where: { orderId } });
      } else {
        await tx.orderNote.upsert({
          where: { orderId },
          create: { orderId, text: noteText },
          update: { text: noteText },
        });
      }
    }
  });

  const out = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      requests: { include: { specialRequest: true } },
      notes: true,
    },
  });

  return json({
    requests: out?.requests.map((r) => ({
      id: r.specialRequestId,
      label: r.specialRequest?.label ?? null,
      value: r.value,
    })) ?? [],
    note: out?.notes?.text ?? null,
  });
}
