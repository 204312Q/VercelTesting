import { prisma } from 'src/server/db';

import { ProductShopView } from 'src/sections/product/view';

export const metadata = { title: `Our Packages` };

export default async function Page() {
  
  // Base packages + duration options
  const rawPackages = await prisma.product.findMany({
    where: { visible: true, type: 'PACKAGE' },
    orderBy: { product_id: 'asc' },
    select: {
      product_id: true,
      name: true,
      description: true,
      price: true, // Decimal
      imageUrl: true,
      options: {
        where: { type: 'PACKAGE_DURATION' },
        orderBy: { value: 'asc' },
        select: { id: true, value: true, price: true }, // Decimal
      },
    },
  });

  // JSON-safe packages
  const packages = rawPackages.map(p => ({
    product_id: p.product_id,
    name: p.name,
    description: p.description,
    imageUrl: p.imageUrl,
    price: p.price == null ? 0 : Number(p.price),
    options: (p.options || []).map(o => ({
      id: o.id,
      value: o.value,
      price: o.price == null ? 0 : Number(o.price),
    })),
  }));

  // Add-ons flattened for ProductAddOnForm
  const rawAddonProducts = await prisma.product.findMany({
    where: { visible: true, type: 'ADDON' },
    orderBy: { product_id: 'asc' },
    select: {
      product_id: true,
      name: true,
      description: true,
      price: true, // Decimal
      imageUrl: true,
      options: {
        where: { OR: [{ type: 'ADDON_SERVING' }, { type: 'ADDON_BUNDLE' }] },
        orderBy: { value: 'asc' },
        select: { id: true, type: true, value: true, price: true }, // Decimal
      },
    },
  });

  // JSON-safe addons
  const addons = rawAddonProducts.flatMap(p => {
    if (p.options?.length) {
      return p.options.map(o => ({
        product_id: o.id, 
        parentProductId: p.product_id,
        name: p.name,
        duration: o.type === 'ADDON_SERVING' ? (o.value ?? 1) : 1,
        price: o.price == null ? Number(p.price ?? 0) : Number(o.price),
        image: p.imageUrl ?? null,
        description: p.description ?? '',
      }));
    }
    return [{
      product_id: p.product_id,
      name: p.name,
      duration: 1,
      price: Number(p.price ?? 0),
      image: p.imageUrl ?? null,
      description: p.description ?? '',
    }];
  });

  return <ProductShopView packages={packages} addons={addons} />;
}
