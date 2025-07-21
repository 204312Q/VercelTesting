'use client';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

import { themeConfig, ThemeProvider } from 'src/theme';
import { LocalizationProvider } from 'src/locales';
import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';
import { CheckoutProvider } from 'src/sections/checkout/context';
import { I18nProvider } from 'src/locales/i18n-provider';

import { CONFIG } from 'src/global-config';

import { AuthProvider as JwtAuthProvider } from 'src/auth/context/jwt';
import { AuthProvider as Auth0AuthProvider } from 'src/auth/context/auth0';
import { AuthProvider as AmplifyAuthProvider } from 'src/auth/context/amplify';
import { AuthProvider as SupabaseAuthProvider } from 'src/auth/context/supabase';
import { AuthProvider as FirebaseAuthProvider } from 'src/auth/context/firebase';

// ----------------------------------------------------------------------

const AuthProvider =
    (CONFIG.auth.method === 'amplify' && AmplifyAuthProvider) ||
    (CONFIG.auth.method === 'firebase' && FirebaseAuthProvider) ||
    (CONFIG.auth.method === 'supabase' && SupabaseAuthProvider) ||
    (CONFIG.auth.method === 'auth0' && Auth0AuthProvider) ||
    JwtAuthProvider;

// ----------------------------------------------------------------------

export default function ClientLayout({ children, appConfig }) {
    return (
        <>
            <InitColorSchemeScript
                defaultMode={themeConfig.defaultMode}
                modeStorageKey={themeConfig.modeStorageKey}
                attribute={themeConfig.cssVariables.colorSchemeSelector}
            />

            <I18nProvider lang={appConfig.i18nLang}>
                <AuthProvider>
                    <SettingsProvider
                        cookieSettings={appConfig.cookieSettings}
                        defaultSettings={defaultSettings}
                    >
                        <LocalizationProvider>
                            <AppRouterCacheProvider options={{ key: 'css' }}>
                                <ThemeProvider
                                    defaultMode={themeConfig.defaultMode}
                                    modeStorageKey={themeConfig.modeStorageKey}
                                >
                                    <MotionLazy>
                                        <CheckoutProvider>
                                            <Snackbar />
                                            <ProgressBar />
                                            <SettingsDrawer defaultSettings={defaultSettings} />
                                            {children}
                                        </CheckoutProvider>
                                    </MotionLazy>
                                </ThemeProvider>
                            </AppRouterCacheProvider>
                        </LocalizationProvider>
                    </SettingsProvider>
                </AuthProvider>
            </I18nProvider>
        </>
    );
}
