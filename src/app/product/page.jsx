import { CONFIG } from 'src/global-config';
// import { getProducts } from 'src/actions/product-ssr';

// import { ProductShopView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

// export const metadata = { title: `Product shop - ${CONFIG.appName}` };

export default async function Page() {
  // const result = await getProducts();
  // return <ProductShopView products={result} />;
  return <h1>Product Shop Page</h1>; // Placeholder for the product shop view
}
