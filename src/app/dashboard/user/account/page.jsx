import { CONFIG } from 'src/global-config';

import { AccountGeneralView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `Account general settings | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  // return <AccountGeneralView />;
  return <h1>Account General Settings</h1>; // Placeholder for the account general settings view
}
