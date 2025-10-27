export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

import { prisma } from 'src/server/db';

export async function GET() {
  const rows = await prisma.specialRequest.findMany({
    where: { active: true },
    orderBy: [{ sort: 'asc' }, { id: 'asc' }],
    select: { id: true, label: true, value: true },
  });
  return NextResponse.json(rows);
}
