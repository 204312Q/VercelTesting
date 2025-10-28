// src/app/api/orders/[id]/items/route.js
// Order Flow - Add Add-on Product
import { prisma } from 'src/server/db';

import { json, badRequest, computeTotals, validatePackageRules } from '../../../_lib';

export async function POST(req, { params }) {
  const { id } = await params;
  const orderId = Number(id);  

  let body;
  try {
    body = await req.json();
  } catch {
    return badRequest('Expected JSON body');
  }

  const explicitProductId = Number(body.product_id ?? body.productId ?? 0) || null;
  const optionId = Number(body.optionId ?? body.productOptionId ?? 0) || null;
  const qty = Number(body.quantity ?? 1);

  if (!optionId && !explicitProductId) {
    return badRequest('optionId (preferred) or product_id is required');
  }
  if (qty < 1) return badRequest('quantity must be >= 1');

  // Load order + its chosen package duration (needed for business rules & totals)
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { productOption: true, items: true },
  });
  if (!order) return badRequest('Order not found');

  // Resolve the option (preferred) and its parent product
  let opt = null;
  if (optionId) {
    opt = await prisma.productOption.findUnique({
      where: { id: optionId },
      include: { product: true },
    });
    if (!opt) return badRequest('Option not found');

    // Only allow addon options here
    const isAddonOpt = ['ADDON_SERVING', 'ADDON_BUNDLE'].includes(opt.type);
    if (!isAddonOpt || opt.product.type !== 'ADDON') {
      return badRequest('Invalid add-on option');
    }
  }

  // Decide the product_id to store
  const resolvedProductId = opt?.productId ?? explicitProductId;
  if (!resolvedProductId) return badRequest('Unable to resolve product for option');

  // If caller also sent product_id, make sure it matches the option’s product
  if (explicitProductId && opt && explicitProductId !== opt.productId) {
    return badRequest('optionId does not belong to the given product');
  }

  // Validate the product really is an ADDON
  const addon = await prisma.product.findUnique({
    where: { product_id: resolvedProductId },
  });
  if (!addon || addon.type !== 'ADDON') return badRequest('Invalid add-on product');

  // Determine unit price
  const unitPrice = opt?.price ?? addon.price;

  // Package rules (e.g., Trial meal caps, etc.)
  try {
    const newItems = [
      ...order.items,
      { price: unitPrice, quantity: qty }, // minimal shape for validatePackageRules
    ];
    validatePackageRules({
      portion: order.portion,
      durationDays: Number(order.productOption.value),
      items: newItems,
    });
  } catch (e) {
    return badRequest(e.message);
  }

  // Create the add-on line
  await prisma.orderItem.create({
    data: {
      orderId,
      product_id: resolvedProductId,
      optionId: opt?.id ?? null,
      quantity: qty,
      price: unitPrice, // per-unit price
      special_request_notes: body.special_request_notes ?? null,
      special_request_options: body.special_request_options ?? null,
    },
  });

  // Recompute order totals
  const fresh = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      productOption: true,
      appliedPromotions: true,
      items: { include: { option: true } }, // <-- need option.type
    },
  });

  // Ignore any (legacy) package lines so we don't double count
  const pricedItems = fresh.items.filter((i) => i.option?.type !== 'PACKAGE_DURATION');

  const discountAmount = fresh.appliedPromotions?.[0]?.discount_amount ?? 0;
  const { subtotal, total } = computeTotals({
    basePrice: fresh.productOption.price,
    items: pricedItems,
    discountAmount,
  });

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { subtotal, total },
  });

  return json(updated);
}
