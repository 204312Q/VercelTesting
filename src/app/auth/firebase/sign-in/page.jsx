import { CONFIG } from 'src/global-config';

import { FirebaseSignInView } from 'src/auth/view/firebase';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign in | Firebase - ${CONFIG.appName}` };

export default function Page() {
  // return <FirebaseSignInView />;
  return <h1>Sign In Page</h1>; // Placeholder for the actual view component
}
