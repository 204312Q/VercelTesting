import { CONFIG } from 'src/global-config';

import { JwtSignInView } from 'src/auth/view/jwt';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign in | Jwt - ${CONFIG.appName}` };

export default function Page() {
  // return <JwtSignInView />;
  return <h1>Sign In Page</h1>; // Placeholder for the actual view component
}
