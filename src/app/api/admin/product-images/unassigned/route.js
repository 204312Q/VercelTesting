// GET /api/admin/product-images/unassigned
// List “unassigned” assets to map → product

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

import { prisma } from 'src/server/db';
import cloudinary from 'src/server/cloudinary';

export async function GET() {
  try {
    let res;
    try {
      res = await cloudinary.search
        .expression('folder:products AND tags=unassigned')
        .sort_by('created_at', 'desc')
        .max_results(100)
        .execute();
    } catch {
      // Fallback: admin list (no query), then filter in JS
      const admin = await cloudinary.api.resources({
        type: 'upload',
        prefix: 'products/', // all assets in products/
        max_results: 100,
      });
      // Simulate the shape used below
      res = { resources: admin.resources };
    }

    const resources = res?.resources ?? [];
    const publicIds = resources.map((r) => r.public_id);

    const linked = await prisma.product.findMany({
      where: { imagePublicId: { in: publicIds } },
      select: { imagePublicId: true },
    });
    const linkedSet = new Set(linked.map((l) => l.imagePublicId));

    const items = resources
      .filter((r) => !linkedSet.has(r.public_id))
      .map((r) => ({
        publicId: r.public_id,
        url: r.secure_url,
        width: r.width,
        height: r.height,
        bytes: r.bytes,
        format: r.format,
        createdAt: r.created_at,
      }));

    return NextResponse.json({ items });
  } catch (e) {
    console.error('[UNASSIGNED_LIST]', e);
    return NextResponse.json({ message: 'Failed to list unassigned images' }, { status: 500 });
  }
}
