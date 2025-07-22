import { CONFIG } from 'src/global-config';

import { FirebaseVerifyView } from 'src/auth/view/firebase';

// ----------------------------------------------------------------------

export const metadata = { title: `Verify | Firebase - ${CONFIG.appName}` };

export default function Page() {
  // return <FirebaseVerifyView />;
  return <h1>Verify Page</h1>; // Placeholder for the actual view component
}
