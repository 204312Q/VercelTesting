// prisma/scripts/seedProduct.js
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { Prisma } from '@prisma/client';
import { prisma } from '../../src/server/db.js';

// ----- env loading (both .env and .env.local) -----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../../');
dotenv.config({ path: path.join(root, '.env') });
dotenv.config({ path: path.join(root, '.env.local') });

// ----- Cloudinary -----
async function getCloudinary() {
  const mod = await import('../../src/lib/cloudinary.js');
  return mod.default;
}

const IS_PROD = process.env.NODE_ENV === 'production';
const UPLOAD_FROM_LOCAL = process.env.SEED_UPLOADS_FROM_LOCAL === 'true';
// console.log('[seed:product] IS_PROD=', IS_PROD, 'UPLOAD_FROM_LOCAL=', UPLOAD_FROM_LOCAL);

// OptionType values — change strings if your enum names differ
const OT = {
  PACKAGE_DURATION: 'PACKAGE_DURATION',
  PARTNER_BUNDLE: 'PARTNER_BUNDLE',
  ADDON_SERVING: 'ADDON_SERVING',
  ADDON_BUNDLE: 'ADDON_BUNDLE',
};

// ----- master config: product + image + options -----
const PRODUCTS = [
  // ========== PACKAGES ==========
  {
    name: 'Dual Meal',
    type: 'PACKAGE',
    price: 498,
    file: 'Meal_Dual.webp',
    publicId: 'products/Meal_Dual',
    durations: [
      { days: 7, price: 498 },
      { days: 14, price: 968 },
      { days: 21, price: 1368 },
      { days: 28, price: 1768 },
    ],
    partnerBundles: [{ daysConstraint: 28, label: 'BMB Massage Package', price: 1500.6 }],
  },
  {
    name: 'Single Meal',
    type: 'PACKAGE',
    price: 498,
    file: 'Meal_Single.webp',
    publicId: 'products/Meal_Single',
    durations: [
      { days: 14, price: 498 },
      { days: 21, price: 728 },
      { days: 28, price: 968 },
    ],
    partnerBundles: [],
  },
  {
    name: 'Trial Meal',
    type: 'PACKAGE',
    price: 38,
    file: 'Meal_Trial.webp',
    publicId: 'products/Meal_Trial',
    durations: [{ days: 1, price: 38 }],
    partnerBundles: [{ daysConstraint: 1, label: 'MyQueen Staycay Package', price: 361 }],
  },

  // ========== ADD-ONS ==========
  {
    name: "Pig's Trotter with Ginger, Vinegar and Egg",
    type: 'ADDON',
    price: 12,
    file: 'Addon_PigTrotter.webp',
    publicId: 'products/Addon_PigTrotter',
    servings: [
      { n: 1, price: 12 },
      { n: 3, price: 35 },
      { n: 5, price: 55 },
    ],
  },
  {
    name: 'Milk Boosting Fish and Papaya Soup',
    type: 'ADDON',
    price: 7,
    file: 'Addon_PapayaFishSoup.webp',
    publicId: 'products/Addon_PapayaFishSoup',
    servings: [
      { n: 1, price: 7 },
      { n: 3, price: 20 },
      { n: 5, price: 32 },
    ],
  },
  {
    name: "Homemade Bird's Nest",
    type: 'ADDON',
    price: 15,
    file: 'Addon_BirdNest.webp',
    publicId: 'products/Addon_BirdNest',
    servings: [
      { n: 1, price: 15 },
      { n: 3, price: 42 },
      { n: 5, price: 66 },
    ],
  },
  {
    name: 'Comforting Set',
    type: 'ADDON',
    price: 32,
    file: 'Addon_ComfortingSet.webp',
    publicId: 'products/Addon_ComfortingSet',
    bundleOnly: [{ label: 'Comforting Set', price: 32 }],
  },
  {
    name: 'Thermal Flask',
    type: 'ADDON',
    price: 10,
    file: 'Addon_ThermalWare.webp',
    publicId: 'products/Addon_ThermalWare',
    servings: [{ n: 1, price: 10 }],
  },
];

// helper: upload local file if allowed
async function uploadIfNeeded(publicId, localPath) {
  if (!UPLOAD_FROM_LOCAL) return null;
  if (!fs.existsSync(localPath)) return null;
  const cloudinary = await getCloudinary();
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      localPath,
      { public_id: publicId, overwrite: false }, // DON'T pass folder; it's in publicId
      (err, res) => (err ? reject(err) : resolve(res)),
    );
  });
}

export default async function seedProduct() {
  for (const p of PRODUCTS) {
    // 1) ensure product exists
    const product = await prisma.product.upsert({
      where: { name: p.name }, // assumes `name` is unique; if not, switch to a unique `slug`
      update: { type: p.type, price: p.price, visible: true },
      create: { name: p.name, type: p.type, price: p.price, visible: true },
    });
    const productId = product.product_id ?? product.id;
    if (!productId) throw new Error(`No product id for ${p.name}`);

    // 2) ensure image exists in Cloudinary (upload in dev when flag on)
    let imageUrl = null;

    if (!IS_PROD && UPLOAD_FROM_LOCAL && p.file) {
      const filePath = path.join(__dirname, '../../public/products', p.file);
      const exists = fs.existsSync(filePath);
      console.log('[seed:product] checking', filePath, 'exists=', exists);
      if (exists) {
        try {
          const uploaded = await uploadIfNeeded(p.publicId, filePath);
          if (uploaded?.secure_url) {
            imageUrl = uploaded.secure_url;
            console.log('[seed:product] uploaded ->', p.publicId);
          }
        } catch (e) {
          console.warn('[seed:product] upload failed for', p.publicId, e?.message || e);
        }
      } else {
        console.warn('[seed:product] local image missing:', p.file);
      }
    }

    if (!imageUrl) {
      try {
        const cld = await getCloudinary();
        const found = await cld.api.resource(p.publicId); // lookup by publicId
        imageUrl = found?.secure_url || null;
        if (imageUrl) console.log('[seed:product] found existing ->', p.publicId);
      } catch (e) {
        console.warn('[seed:product] not found in Cloudinary:', p.publicId, e?.message || e);
      }
    }

    // 3) write refs onto the product (URL may be null; UI should fall back to publicId/placeholder)
    await prisma.product.update({
      where: { name: p.name },
      data: {
        imagePublicId: p.publicId,
        imageUrl: imageUrl,
      },
    });

    // 4) (re)seed product options according to type
    await prisma.productOption.deleteMany({ where: { productId } });

    if (p.type === 'PACKAGE') {
      const durationOpts = (p.durations ?? []).map((d) => ({
        productId,
        type: OT.PACKAGE_DURATION,
        label: `${d.days} Days`,
        value: d.days,
        price: new Prisma.Decimal(d.price),
      }));

      const bundleOpts = (p.partnerBundles ?? []).map((b) => ({
        productId,
        type: OT.PARTNER_BUNDLE,
        label: b.label,
        value: b.daysConstraint ?? 1,
        price: new Prisma.Decimal(b.price),
      }));

      const data = [...durationOpts, ...bundleOpts];
      if (data.length) {
        const { count } = await prisma.productOption.createMany({ data, skipDuplicates: true });
        console.log(`[seed:product] ${p.name} options: +${count}`);
      }
    } else {
      const servingOpts = (p.servings ?? []).map((s) => ({
        productId,
        type: OT.ADDON_SERVING,
        label: `${s.n} Serving${s.n > 1 ? 's' : ''}`,
        value: s.n,
        price: new Prisma.Decimal(s.price),
      }));

      const bundleOpts = (p.bundleOnly ?? []).map((b) => ({
        productId,
        type: OT.ADDON_BUNDLE,
        label: b.label,
        value: 1,
        price: new Prisma.Decimal(b.price),
      }));

      const data = [...servingOpts, ...bundleOpts];
      if (data.length) {
        const { count } = await prisma.productOption.createMany({ data, skipDuplicates: true });
        console.log(`[seed:product] ${p.name} options: +${count}`);
      }
    }
  }

  console.log('✅ Products + images seeded');
}
