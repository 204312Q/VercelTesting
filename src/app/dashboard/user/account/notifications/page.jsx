import { CONFIG } from 'src/global-config';

import { AccountNotificationsView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `Account notifications settings | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  // return <AccountNotificationsView />;
  return <h1>Account Notifications Settings</h1>; // Placeholder for the account notifications settings view
}
