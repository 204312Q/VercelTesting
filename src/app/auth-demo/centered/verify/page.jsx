import { CONFIG } from 'src/global-config';

import { CenteredVerifyView } from 'src/auth/view/auth-demo/centered';

// ----------------------------------------------------------------------

export const metadata = { title: `Verify | Layout centered - ${CONFIG.appName}` };

export default function Page() {
  // return <CenteredVerifyView />;
  return <h1>Verify Page - demo</h1>; // Placeholder for the actual view component
}
