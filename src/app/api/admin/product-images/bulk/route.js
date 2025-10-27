// POST /api/admin/product-images/bulk
// For Bulk upload many images to Cloudinary folder under products/ directory 
// (Image that not linked to product yet = unassigned tag)

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

import cloudinary from 'src/server/cloudinary';

export async function POST(req) {
  try {
    const form = await req.formData();
    const files = form.getAll('files');
    if (!files?.length) return NextResponse.json({ message: 'No files' }, { status: 400 });

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    const results = [];

    for (const f of files) {
      if (!allowed.includes(f.type)) continue;
      if (f.size > 5 * 1024 * 1024) continue;

      const buf = Buffer.from(await f.arrayBuffer());
      const upload = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: 'products', resource_type: 'image', overwrite: false, tags: ['unassigned'] },
            (err, res) => (err ? reject(err) : resolve(res))
          )
          .end(buf);
      });

      results.push({
        publicId: upload.public_id,
        url: upload.secure_url,
        width: upload.width,
        height: upload.height,
        bytes: upload.bytes,
        format: upload.format,
      });
    }

    return NextResponse.json({ uploaded: results });
  } catch (e) {
    console.error('[BULK_UPLOAD]', e);
    return NextResponse.json({ message: 'Bulk upload failed' }, { status: 500 });
  }
}
