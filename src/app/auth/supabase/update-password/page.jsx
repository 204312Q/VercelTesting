import { CONFIG } from 'src/global-config';

import { SupabaseUpdatePasswordView } from 'src/auth/view/supabase';

// ----------------------------------------------------------------------

export const metadata = { title: `Update password | Supabase - ${CONFIG.appName}` };

export default function Page() {
  // return <SupabaseUpdatePasswordView />;
  return <h1>Update Password Page</h1>; // Placeholder for the actual view component
}
