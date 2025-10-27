'use client';

import { useState, useEffect } from 'react';
import { useBackToTop } from 'minimal-shared/hooks';

import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';

import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { HomeHero } from '../home-hero';
import { HomeMenu } from '../home-menu';
import { Benefits } from '../home-benefit';
import { HomeFeature } from '../home-feature';
import { HomePartners } from '../home-partners';
import { TopPackages } from '../home-top-packages';
import { HomeOrderSteps } from '../home-orderSteps';
import { HomePopularDish } from '../home-populardish';
// import { _mock } from 'src/_mock';

// ----------------------------------------------------------------------

export function HomeView() {
  const pageProgress = useScrollProgress();

  const { onBackToTop, isVisible } = useBackToTop('90%');
  const [banners, setBanners] = useState([]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

  useEffect(() => {
    const fetchBanners = () => {
      fetch(`${API_BASE_URL ? API_BASE_URL.replace(/\/$/, '') : ''}/api/banner`, { cache: 'no-store' })
        .then((res) => {
        if (!res.ok) throw new Error(`GET /api/banner ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.banners ?? [];
        const activeBanners = list.filter((b) => b?.isActive);
        setBanners(activeBanners);
      })
      .catch((err) => console.error('Error fetching banners:', err));
  };
    
   fetchBanners();
   const interval = setInterval(fetchBanners, 30000); // Refresh every 30 secs
    return () => clearInterval(interval); 
}, [API_BASE_URL]);

  return (
    <>
      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={[(theme) => ({ position: 'fixed', zIndex: theme.zIndex.appBar + 1, top: 0, left: 0, width: '100%' })]}
      />

      <BackToTopButton isVisible={isVisible} onClick={onBackToTop} />

      <HomeHero data={banners.map((b) => ({
        ...b,
        coverUrl: b.imageUrl,
      }))} />

      <Stack
        sx={{
          position: 'relative',
          px: { xs: 1, sm: 2, md: 4 },
          py: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <TopPackages /> {/* Top 3 Selling Packages */}
        <Benefits /> {/* Why Choose Us? */}

        <HomeMenu /> {/* X Done */}
        <HomeFeature /> {/* X Done - 3 reroute to other products with "View More" */}

        <HomePopularDish /> {/* Our Popular Dishes */}
        <HomeOrderSteps sx={{ mt: 4 }} /> {/* What's the next step? */}
        <HomePartners sx={{ mt: 4 }} /> {/* Partners */}

      </Stack>
    </>
  );
}

// ----------------------------------------------------------------------

function BackToTopButton({ isVisible, sx, ...other }) {
  return (
    <Fab
      aria-label="Back to top"
      sx={[
        (theme) => ({
          width: 48,
          height: 48,
          position: 'fixed',
          transform: 'scale(0)',
          right: { xs: 24, md: 32 },
          bottom: { xs: 24, md: 32 },
          zIndex: theme.zIndex.speedDial,
          transition: theme.transitions.create(['transform']),
          ...(isVisible && { transform: 'scale(1)' }),
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <SvgIcon>
        {/* https://icon-sets.iconify.design/solar/double-alt-arrow-up-bold-duotone/ */}
        <path
          fill="currentColor"
          d="M5 17.75a.75.75 0 0 1-.488-1.32l7-6a.75.75 0 0 1 .976 0l7 6A.75.75 0 0 1 19 17.75z"
          opacity="0.5"
        />
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M4.43 13.488a.75.75 0 0 0 1.058.081L12 7.988l6.512 5.581a.75.75 0 1 0 .976-1.138l-7-6a.75.75 0 0 0-.976 0l-7 6a.75.75 0 0 0-.081 1.057"
          clipRule="evenodd"
        />
      </SvgIcon>
    </Fab>
  );
}
