import { CONFIG } from 'src/global-config';

import { AccountBillingView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `Account billing settings | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  // return <AccountBillingView />;
  return <h1>Account Billing Settings</h1>; // Placeholder for the account billing settings view
}
