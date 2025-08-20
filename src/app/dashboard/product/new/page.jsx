import { CONFIG } from 'src/global-config';

import { ProductCreateView } from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new product | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ProductCreateView />;
}

// Force dynamic rendering to avoid serialization issues
export const dynamic = 'force-dynamic';
