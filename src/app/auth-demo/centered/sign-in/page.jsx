import { CONFIG } from 'src/global-config';

import { CenteredSignInView } from 'src/auth/view/auth-demo/centered';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign in | Layout centered - ${CONFIG.appName}` };

export default function Page() {
  // return <CenteredSignInView />;
  return <h1>Sign In Page - demo</h1>; // Placeholder for the actual view component
}
