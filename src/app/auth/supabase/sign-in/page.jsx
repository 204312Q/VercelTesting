import { CONFIG } from 'src/global-config';

import { SupabaseSignInView } from 'src/auth/view/supabase';

// ----------------------------------------------------------------------

export const metadata = { title: `Sign in | Supabase - ${CONFIG.appName}` };

export default function Page() {
  // return <SupabaseSignInView />;
  return <h1>Sign In Page</h1>; // Placeholder for the actual view component
}
