// List confirmations (Export status with filters/pagination)
import { NextResponse } from 'next/server';

import { prisma } from 'src/server/db';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') || 1);
  const pageSize = Math.min(Number(searchParams.get('pageSize') || 20), 100);
  const status = searchParams.get('status'); // PENDING|SENT|FAILED (ExportStatus Enum)
  const q = {
    where: status ? { export_status: status } : {},
    orderBy: { created_at: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
    select: {
      order_id: true,
      payload_version: true,
      export_status: true,
      export_attempts: true,
      last_error: true,
      external_id: true,
      created_at: true,
      updated_at: true,
      payload: {
        select: { order: { select: { id: true, createdAt: true, customer: true, pricing: true } } }
      }
    }
  };
  const [rows, total] = await Promise.all([
    prisma.orderConfirmation.findMany(q),
    prisma.orderConfirmation.count({ where: q.where })
  ]);
  return NextResponse.json({ page, pageSize, total, rows });
}
