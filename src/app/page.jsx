'use client';

import { useEffect } from 'react';

import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export default function Page() {
  // const router = useRouter();

  // useEffect(() => {
  //   router.push(CONFIG.auth.redirectPath);
  // }, [router]);



  return <h1 style={{ padding: 40 }}>✅ HOME PAGE LOADED</h1>;;
}
