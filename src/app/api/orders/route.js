// src/app/api/orders/route.js
// Create draft order
import { MealPortion, MealSession } from '@prisma/client';

import { prisma } from 'src/server/db';

import { json, badRequest, computeTotals, validatePackageRules } from '../_lib';


// const STRICT_TRIAL_RULES = true;

// Uppercase-normalizer for enums coming from UI
const U = (v) => String(v ?? '').trim().toUpperCase();

// Helper for detect the "Staycay" partner bundle option
const isStaycayBundle = (opt) =>
  !!opt &&
  opt.type === 'PARTNER_BUNDLE' &&
  (/\bstaycay\b/i.test(opt.label ?? '') || /\bstaycay\b/i.test(opt.product?.name ?? ''));

export async function POST(req) {
  const body = await req.json();
  
  const {
    productId,
    productOptionId, // Required - Package duration optionId
    bundleOptionId, // Optional - Partner bundle optionId
    portion, // DUAL | SINGLE | TRIAL
    session, // LUNCH | DINNER | null
    input_type, // CONFIRMED_DATE | EDD
    input_date, // Date iso string
  } = body || {};

  // ---------- Normalize enums ----------
  const pPortion = U(portion);
  let pSession = session == null ? null : U(session);
  let pInputType = U(input_type);

  // ---------- Guard numeric IDs early ----------
  const productOptionIdNum = Number(productOptionId);
  if (!Number.isFinite(productOptionIdNum)) {
    return badRequest(`productOptionId must be a number; got "${productOptionId}"`);
  }
  const bundleOptionIdNum = bundleOptionId == null ? null : Number(bundleOptionId);
  if (bundleOptionId != null && !Number.isFinite(bundleOptionIdNum)) {
    return badRequest(`bundleOptionId must be a number; got "${bundleOptionId}"`);
  }

  // ---------- Load package option ----------
  const pkgOpt = await prisma.productOption.findUnique({
    where: { id: productOptionIdNum },
    include: { product: true },
  });

  if (!pkgOpt) return badRequest(`package option not found: id=${productOptionIdNum}`);
  if (pkgOpt.type !== 'PACKAGE_DURATION') return badRequest('package option must be PACKAGE_DURATION');
  if (pkgOpt.product.type !== 'PACKAGE') return badRequest('package option must belong to a PACKAGE product');

  if (productId != null && Number(productId) !== pkgOpt.productId) {
    return badRequest('productId does not match the selected package option');
  }

  // ---------- Load/validate bundle option ----------
  let bundleOpt = null;
  if (bundleOptionId != null) {
    bundleOpt = await prisma.productOption.findUnique({
      where: { id: bundleOptionIdNum },
      include: { product: true },
    });

    if (!bundleOpt) return badRequest(`bundle option not found: id=${bundleOptionIdNum}`);
    if (bundleOpt.type !== 'PARTNER_BUNDLE') return badRequest('Invalid bundle option');
    if (bundleOpt.productId !== pkgOpt.productId) return badRequest('Bundle does not belong to selected package');

    const pkgName = pkgOpt.product.name ?? '';
    const durationDays = Number(pkgOpt.value);
    const bundleName = (bundleOpt.label ?? '').trim().toLowerCase();

    // BMB Massage Package  → only Dual Meal 28 days
    if (bundleName === 'bmb massage package') {
      if (!(pkgName === 'Dual Meal' && durationDays === 28 && pPortion === 'DUAL')) {
        return badRequest('BMB Massage Package is only available with Dual Meal (28 days)');
      }
    }

    // MyQueen Staycay Package → only Trial Meal 1 day
    if (bundleName === 'myqueen staycay package') {
      if (!(pkgName === 'Trial Meal' && durationDays === 1 && pPortion === 'TRIAL')) {
        return badRequest('MyQueen Staycay Package is only available with Trial Meal (1 day)');
      }
    }
  }

  const staycay = isStaycayBundle(bundleOpt);

  // ---------- Trial-specific rules ----------
  if (pPortion === 'TRIAL') {
    // Trial must use CONFIRMED_DATE
    if (!pInputType) pInputType = 'CONFIRMED_DATE';
    else if (pInputType !== 'CONFIRMED_DATE') {
      return badRequest('Trial meal must use CONFIRMED_DATE (EDD not allowed).');
    }

    if (staycay) {
      if (pSession && pSession !== 'DINNER') {
        return badRequest('Staycay bundle requires DINNER session for trial meals.');
      }
      pSession = 'DINNER';
    } else {
      if (pSession !== 'LUNCH' && pSession !== 'DINNER') {
        return badRequest('Trial (CONFIRMED_DATE) requires session: LUNCH or DINNER.');
      }
    }
  }

  // ---------- General date/session rules ----------
  if (!input_date) return badRequest('input_date is required');
  const dt = new Date(input_date);
  if (Number.isNaN(dt.getTime())) return badRequest('input_date must be a valid ISO date');

  if (pPortion !== 'TRIAL' && !pInputType) {
    if (!pInputType) return badRequest('input_type is required (CONFIRMED_DATE or EDD).');
  }

  if (pInputType === 'EDD') {
    if (pSession != null) return badRequest('session must be null when input_type is EDD');
  } else if (pInputType === 'CONFIRMED_DATE') {
    if (pSession !== 'LUNCH' && pSession !== 'DINNER') {
      return badRequest('session (LUNCH/DINNER) is required when input_type is CONFIRMED_DATE');
    }
  } else {
    return badRequest('Invalid input_type');
  }

  const sessionToStore = pInputType === 'EDD' ? null : pSession;

  // ---------- Portion+duration rules ----------
  const durationDays = parseInt(String(pkgOpt.value), 10);
  try {
    validatePackageRules({ portion: pPortion, durationDays, items: [] });
  } catch (e) {
    return badRequest(e.message);
  }

  // ---------- Totals ----------
  const base = Number(pkgOpt.price) + (bundleOpt ? Number(bundleOpt.price) : 0);
  const { subtotal, total } = computeTotals({ basePrice: base });

  const order = await prisma.order.create({
    data: {
      productId: pkgOpt.productId,
      portion: MealPortion[pPortion] ?? pPortion,
      session: sessionToStore == null ? null : MealSession[sessionToStore],
      input_type: pInputType,
      input_date: dt,
      productOptionId: pkgOpt.id,
      status: 'UNFULFILLED',
      subtotal,
      discount: 0,
      total,
      items: bundleOpt
        ? {
            create: [
              {
                product_id: bundleOpt.productId,
                optionId: bundleOpt.id,
                quantity: 1,
                price: bundleOpt.price,
                special_request_notes: null,
                special_request_options: null,
              },
            ],
          }
        : undefined,
    },
    include: { items: true },
  });

  return json(order);
}
