export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

import { prisma } from 'src/server/db';
import cloudinary from 'src/server/cloudinary';

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const productId = Number(id); 
    const { publicId } = await req.json();
    if (!publicId) return NextResponse.json({ message: 'publicId required' }, { status: 400 });

    const product = await prisma.product.findUnique({ where: { product_id: productId } });
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });

    const asset = await cloudinary.api.resource(publicId, { resource_type: 'image' });

    if (product.imagePublicId && product.imagePublicId !== publicId) {
      try { 
        await cloudinary.uploader.destroy(product.imagePublicId); 
      } catch (err) {
        console.warn('[CLOUDINARY_DESTROY_OLD]', err?.message || err);
      }
    }

    try {
      await cloudinary.uploader.remove_tag('unassigned', [publicId]);
      await cloudinary.uploader.add_tag(`product:${productId}`, [publicId]);
    } catch (err) {
      console.warn('[CLOUDINARY_TAG_UPDATE]', err?.message || err);
    }

    const updated = await prisma.product.update({
      where: { product_id: productId },
      data: { imageUrl: asset.secure_url, imagePublicId: publicId },
      select: { product_id: true, name: true, imageUrl: true, imagePublicId: true },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error('[LINK_PRODUCT_IMAGE]', e);
    return NextResponse.json({ message: 'Link failed' }, { status: 500 });
  }
}
