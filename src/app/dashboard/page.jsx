import { CONFIG } from 'src/global-config';

import { OverviewAnalyticsView } from 'src/sections/overview/analytics/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Dashboard - ${CONFIG.appName}` };

export default function Page() {
  // return <OverviewAnalyticsView />;
  return <h1>Dashboard Overview</h1>; // Placeholder for the overview analytics view
}
