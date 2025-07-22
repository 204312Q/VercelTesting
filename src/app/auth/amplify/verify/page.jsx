import { CONFIG } from 'src/global-config';

import { AmplifyVerifyView } from 'src/auth/view/amplify';

// ----------------------------------------------------------------------

export const metadata = { title: `Verify | Amplify - ${CONFIG.appName}` };

export default function Page() {
  // return <AmplifyVerifyView />;
  return <h1>Verify Page</h1>; // Placeholder for the actual view component
}
