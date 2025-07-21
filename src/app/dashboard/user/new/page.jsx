import { CONFIG } from 'src/global-config';

import { UserCreateView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Create a new user | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  // return <UserCreateView />;
  return <h1>Create a new user</h1>; // Placeholder for the user creation view
}
