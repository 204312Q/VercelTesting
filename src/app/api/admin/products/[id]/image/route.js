// POST|DELETE /api/admin/products/[id]/image

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

import { prisma } from 'src/server/db';
import cloudinary from 'src/server/cloudinary';

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const productId = Number(id);
    if (!Number.isFinite(productId)) {
      return NextResponse.json({ error: 'Invalid product id' }, { status: 400 });
    }

    const form = await req.formData();
    const file = form.get('file');
    if (!file) return NextResponse.json({ message: 'No file' }, { status: 400 });
    
    // Optional - validatiion of file type/size
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) return NextResponse.json({ message: 'Unsupported type' }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ message: 'Max 5MB' }, { status: 400 });

    const exists = await prisma.product.findUnique({ where: { product_id: productId }, select: { product_id: true } });
    if (!exists) return NextResponse.json({ message: 'Product not found' }, { status: 404 });

    // Upload to Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);

    
    const uploadRes = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
          { 
            folder: 'products', 
            resource_type: 'image', 
            overwrite: true,
            public_id: `product_${productId}`,
          },
          (err, res) => (err ? reject(err) : resolve(res))
        );
        stream.end(buf);
    });

    // Persist URL in DB
    const updated = await prisma.product.update({
      where: { product_id: productId },
      data: { imageUrl: uploadRes.secure_url },
      select: { product_id: true, name: true, imageUrl: true, imagePublicId: true },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error('[PRODUCT_IMAGE_UPLOAD] Error:', e);
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
  }
}

// Delete from Cloudinary and clear from DB
export async function DELETE(_req, { params }) {
  try {
    const { id } = await params;
    const productId = Number(id);
    const product = await prisma.product.findUnique({
      where: { product_id: productId },
      select: { imagePublicId: true },
    });
    if (!product) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    // If stored imagePublicId, delete from Cloudinary
    if (product.imagePublicId) {
      try { 
        await cloudinary.uploader.destroy(product.imagePublicId); 
      } catch (err){
        console.warn('[CLOUDINARY_DESTROY]', err?.message || err);
      }
    }

    const cleared = await prisma.product.update({
      where: { product_id: productId },
      data: { imageUrl: null, imagePublicId: null },
      select: { product_id: true, name: true, imageUrl: true, imagePublicId: true },
    });

    return NextResponse.json(cleared);
  } catch (e) {
    console.error('[PRODUCT_IMAGE_DELETE]', e);
    return NextResponse.json({ message: 'Delete failed' }, { status: 500 });
  }
}
