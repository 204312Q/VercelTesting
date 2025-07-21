import 'src/global.css';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

import { themeConfig, ThemeProvider } from 'src/theme';
import { primary } from 'src/theme/core/palette';

export const metadata = {
  title: 'Chilli Padi Confinement',
  icons: [
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
  ],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primary.main,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript
          defaultMode={themeConfig.defaultMode}
          modeStorageKey={themeConfig.modeStorageKey}
          attribute={themeConfig.cssVariables.colorSchemeSelector}
        />

        <AppRouterCacheProvider options={{ key: 'css' }}>
          <ThemeProvider
            defaultMode={themeConfig.defaultMode}
            modeStorageKey={themeConfig.modeStorageKey}
          >
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
