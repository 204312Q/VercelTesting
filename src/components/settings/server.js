import 'server-only'; 

import { cookies } from 'next/headers';

import { SETTINGS_STORAGE_KEY } from './settings-config';

// import { headers } from 'next/headers'

// ----------------------------------------------------------------------

export async function detectSettings(storageKey = SETTINGS_STORAGE_KEY) {
  // const cookieStore = cookies();
  // const settingsStore = cookieStore.get(storageKey);
  // return settingsStore ? JSON.parse(settingsStore?.value) : defaultSettings;
  const store = await cookies(); // ✅ must await
  const raw = store.get('app-settings')?.value;
  try {
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {}; // be defensive if cookie is malformed
  }
}
