import { CONFIG } from 'src/global-config';

import { AmplifyUpdatePasswordView } from 'src/auth/view/amplify';

// ----------------------------------------------------------------------

export const metadata = { title: `Update password | Amplify - ${CONFIG.appName}` };

export default function Page() {
  // return <AmplifyUpdatePasswordView />;
  return <h1>Update Password Page</h1>; // Placeholder for the actual view component
}
