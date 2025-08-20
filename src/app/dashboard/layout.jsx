import { CONFIG } from 'src/global-config';
import { DashboardLayout } from 'src/layouts/dashboard';

// import { AuthGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  // if (CONFIG.auth.skip) {
  //   return <DashboardLayout>{children}</DashboardLayout>;
  // }

  return (
    <DashboardLayout>{children}</DashboardLayout>
  );
}
