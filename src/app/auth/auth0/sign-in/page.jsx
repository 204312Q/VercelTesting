import { CONFIG } from 'src/global-config';

import { Auth0SignInView } from 'src/auth/view/auth0';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign in | Auth0 - ${CONFIG.appName}` };

export default function Page() {
  //   return <Auth0SignInView />;
  return <h1>Sign In Page</h1>; // Placeholder for the actual view component
}
