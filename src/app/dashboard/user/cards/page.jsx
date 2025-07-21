import { CONFIG } from 'src/global-config';

import { UserCardsView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export const metadata = { title: `User cards | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  // return <UserCardsView />;
  return <h1>User Cards</h1>; // Placeholder for the user cards view
}
