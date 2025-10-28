// prisma/scripts/seedBanner.js
import * as dotenv from 'dotenv';
import { prisma } from '../../src/server/db.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../../');

dotenv.config({ path: path.join(root, '.env') });        // base
dotenv.config({ path: path.join(root, '.env.local') });  // overrides if present

// dynamic import for Cloudinary
async function getCloudinary() {
  const mod = await import('../../src/lib/cloudinary.js');
  return mod.default;
}

const IS_PROD = process.env.NODE_ENV === 'production';
// If true, upload from local files; else assume already uploaded
const UPLOAD_FROM_LOCAL = process.env.SEED_UPLOADS_FROM_LOCAL === 'true';
console.log('[seed] IS_PROD=', IS_PROD, 'UPLOAD_FROM_LOCAL=', UPLOAD_FROM_LOCAL);

const BANNERS = [
  {
    publicId: 'banners/confinement_banner_1',
    file: 'Confinement_Banner_1.jpg',
    title: 'Confinement Banner 1',
    sortOrder: 1,
  },
  {
    publicId: 'banners/confinement_banner_2',
    file: 'Confinement_Banner_2.png',
    title: 'Confinement Banner 2',
    sortOrder: 2,
  },
  {
    publicId: 'banners/confinement_banner_3',
    file: 'Confinement_Banner_3.png',
    title: 'Confinement Banner 3',
    sortOrder: 3,
  },
];

async function uploadIfNeeded(publicId, localPath) {
  const cloudinary = await getCloudinary();
  if (!UPLOAD_FROM_LOCAL) return null; // skip uploads when flag is off
  if (!fs.existsSync(localPath)) return null; // only upload if the file exists

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      localPath,
      { public_id: publicId, overwrite: false }, // no accidental overrides
      (error, result) => (error ? reject(error) : resolve(result)),
    );
  });
}

// async function uploadImageToCloudinary(localPath, publicId) {
//   const cloudinary = await getCloudinary();

//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(
//       localPath,
//       {
//         folder: 'banners',
//         public_id: publicId,
//       },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result);
//       }
//     );
//   });
// }

export default async function seedBanner() {
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@cpconfinement.com.sg' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@cpconfinement.com.sg',
      passwordHash: await (await import('bcrypt')).default.hash('Cp#4dm!n', 10),
      role: 'SUPERADMIN',
    },
  });

  // const bannersToSeed = [
  //   {
  //     file: 'Confinement_Banner_1.jpg',
  //     title: 'Confinement Banner 1',
  //     sortOrder: 1,
  //   },
  //   {
  //     file: 'Confinement_Banner_2.png',
  //     title: 'Confinement Banner 2',
  //     sortOrder: 2,
  //   },
  //   {
  //     file: 'Confinement_Banner_3.jpg',
  //     title: 'Confinement Banner 3',
  //     sortOrder: 3,
  //   },
  // ];

  // const seedData = [];

  // for (const b of bannersToSeed) {
  //   const filePath = path.join(__dirname, '../../public/banners', banner.file);

  //   if (!fs.existsSync(filePath)) {
  //     console.warn(`⚠️ Skipping ${banner.file} — file not found.`);
  //     continue;
  //   }

  //   const publicId = path.parse(banner.file).name;
  //   const result = await uploadImageToCloudinary(filePath, publicId);

  //   seedData.push({
  //     title: banner.title,
  //     imageUrl: result.secure_url,
  //     publicId: result.public_id,
  //     sortOrder: banner.sortOrder,
  //     isActive: true,
  //     createdById: admin.id,
  //   });
  //   // console.log(`✅ Uploaded ${banner.file} → ${result.secure_url}`);
  // }

  // if (seedData.length > 0) {
  //   await prisma.banner.createMany({ data: seedData });
  //   console.log('✅ Seeded banners.');
  // } else {
  //   console.log('⚠️ No banners inserted.');
  // }
  for (const b of BANNERS) {
    let imageUrl = null;

    // In dev (or when explicitly enabled), upload from local if asset doesn’t exist yet
    if (!IS_PROD && UPLOAD_FROM_LOCAL) {
      const filePath = path.join(__dirname, '../../public/banners', b.file);
      console.log('[seed] checking', filePath, 'exists=', fs.existsSync(filePath));

      try {
        const uploaded = await uploadIfNeeded(b.publicId, filePath);
        if (uploaded?.secure_url) imageUrl = uploaded.secure_url;
      } catch (e) {
        console.warn(`Upload skipped/failed for ${b.publicId}: ${e.message}`);
      }
    }

    // If not uploaded now, try to fetch the existing asset URL (prod expects assets are already in Cloudinary)
    if (!imageUrl) {
      try {
        const cloudinary = await getCloudinary();
        // Simpler single-asset admin call:
        const found = await cloudinary.api.resource(b.publicId);
        if (found?.secure_url) {
          imageUrl = found.secure_url;
          console.log('[seed] found existing in Cloudinary:', b.publicId, '->', imageUrl);
        }
      } catch (e) {
        console.warn('[seed] not found in Cloudinary:', b.publicId, e?.message || e);
      }
    }

    // Upsert so reruns are safe
    await prisma.banner.upsert({
      where: { publicId: b.publicId }, // ensure unique index on publicId in Prisma
      update: {
        title: b.title,
        imageUrl: imageUrl ?? undefined, // don’t blank existing URL if we couldn’t fetch now
        sortOrder: b.sortOrder,
        isActive: true,
      },
      create: {
        title: b.title,
        publicId: b.publicId,
        imageUrl: imageUrl ?? '', // can be empty initially (frontend should handle graceful fallback)
        sortOrder: b.sortOrder,
        isActive: true,
        createdById: admin.id,
      },
    });
  }

  console.log('✅ Banners seeded (idempotent).');
}
