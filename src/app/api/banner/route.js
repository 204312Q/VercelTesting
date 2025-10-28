// GET /api/banner-list
import { NextResponse } from 'next/server';

import { prisma } from 'src/server/db';

export const runtime = 'nodejs'; // Prisma requires Node.js runtime
export const dynamic = 'force-dynamic'; // No caching
export const revalidate = 0;


export async function GET(req) {
  // const banners = await prisma.banner.findMany({
  //   orderBy: { sortOrder: 'asc' },
  // });
  // return NextResponse.json(banners);
  try {
    const rows = await prisma.banner.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        title: true,
        sortOrder: true,
        isActive: true,
        imageUrl: true,
        publicId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // BigInt-safe serialization (id may be BigInt in your schema)
    const banners = rows.map((b) => ({
      ...b,
      id: typeof b.id === 'bigint' ? b.id.toString() : b.id,
    }));

    return NextResponse.json(banners, {
      headers: { 'Cache-Control': 'no-store' },
      status: 200,
    });
  } catch (err) {
    console.error('[BANNER_GET_ERROR]', err);
    return NextResponse.json({ message: 'Failed to fetch banners' }, { status: 500 });
  }
}
