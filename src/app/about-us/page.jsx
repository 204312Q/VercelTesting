import { CONFIG } from 'src/global-config';

import { AboutView } from 'src/sections/about/view';

// ----------------------------------------------------------------------

export const metadata = { title: `About us - ${CONFIG.appName}` };

export default function Page() {
  // return <AboutView />;
  return <h1>About Us</h1>; // Placeholder for the AboutView component
}
