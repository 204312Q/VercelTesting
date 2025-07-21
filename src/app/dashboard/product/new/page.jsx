import { CONFIG } from 'src/global-config';

import { ProductCreateView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new product | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  // return <ProductCreateView />;
  return <h1>Create a new product</h1>; // Placeholder for the product creation view
}
