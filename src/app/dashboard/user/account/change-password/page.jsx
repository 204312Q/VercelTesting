import { CONFIG } from 'src/global-config';

import { AccountChangePasswordView } from 'src/sections/account/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: `Account change password settings | Dashboard - ${CONFIG.appName}`,
};

export default function Page() {
  // return <AccountChangePasswordView />;
  return <h1>Account Change Password Settings</h1>; // Placeholder for the account change password settings view
}
