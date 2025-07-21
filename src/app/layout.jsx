import 'src/global.css';

import { CONFIG } from 'src/global-config';
import { primary } from 'src/theme/core/palette';
import ClientLayout from 'src/components/layouts/ClientLayout';
import { detectLanguage } from 'src/locales/server';
import { detectSettings } from 'src/components/settings/server';
import { defaultSettings } from 'src/components/settings';

// ----------------------------------------------------------------------

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primary.main,
};

export const metadata = {
  title: 'Chilli Padi Confinement',
  icons: [
    {
      rel: 'icon',
      url: `${CONFIG.assetsDir}/favicon.ico`,
    },
  ],
};

async function getAppConfig() {
  if (CONFIG.isStaticExport) {
    return {
      lang: 'en',
      i18nLang: undefined,
      cookieSettings: undefined,
      dir: defaultSettings.direction,
    };
  } else {
    const [lang, settings] = await Promise.all([detectLanguage(), detectSettings()]);

    return {
      lang: lang ?? 'en',
      i18nLang: lang ?? 'en',
      cookieSettings: settings,
      dir: settings.direction,
    };
  }
}

export default async function RootLayout({ children }) {
  const appConfig = await getAppConfig();

  return (
    <html lang={appConfig.lang} dir={appConfig.dir} suppressHydrationWarning>
      <body>
        <ClientLayout appConfig={appConfig}>{children}</ClientLayout>
      </body>
    </html>
  );
}
