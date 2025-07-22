import { CONFIG } from 'src/global-config';

import { CenteredUpdatePasswordView } from 'src/auth/view/auth-demo/centered';

// ----------------------------------------------------------------------

export const metadata = {
  title: `Update password | Layout centered - ${CONFIG.appName}`,
};

export default function Page() {
  // return <CenteredUpdatePasswordView />;
  return <h1>Update Password Page - demo</h1>; // Placeholder for the actual view component
}
