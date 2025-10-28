// src/app/api/admin/banner/route.js
import slugify from 'slugify';
import { NextResponse } from 'next/server.js';

import { prisma } from 'src/server/db';

import cloudinary from '../../../../lib/cloudinary.js';

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('image');
    const title = formData.get('title')?.toString() || '';
    const sortOrderRaw = formData.get('sortOrder')?.toString() || '0';
    const isActiveRaw = formData.get('isActive')?.toString() || 'false';
    
    const sortOrder = Number.isNaN(parseInt(sortOrderRaw, 10)) ? 0 : parseInt(sortOrderRaw, 10);
    const isActive = isActiveRaw === 'true';

    // Validation
    if (!file || typeof file === 'string') {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }

    // Format validation
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Unsupported file type. Allowed: JPG, PNG, WEBP.' },
        { status: 400 },
      );    
    }

    // Size validation
    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
    if (file.size > maxSizeBytes) {
      return NextResponse.json({ message: 'File too large. Max size is 5MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'banners',
          public_id: slugify(title || 'banner', { lower: true, strict: true }),
          resource_type: 'image',
        },
        (error, res) => {
          if (error) reject(error);
          else resolve(res);
        }
      );
      stream.end(buffer);
    });

    const imageUrl = result.secure_url;
    const publicId = result.public_id;

    await prisma.banner.create({
      data: {
        title,
        sortOrder,
        isActive,
        imageUrl,
        publicId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[UPLOAD_ERROR]', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
