'use client';

import { useBackToTop } from 'minimal-shared/hooks';

import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';

import { ScrollProgress, useScrollProgress } from 'src/components/animate/scroll-progress';

import { HomeHero } from '../home-hero';
import { TopPackages } from '../home-top-packages';
import { Benefits } from '../home-benefit';
import { HomeFeature } from '../home-feature';
import { HomeMenu } from '../home-menu';
import { HomePopularDish } from '../home-populardish';
import { HomeOrderSteps } from '../home-orderSteps';
import { HomePartners } from '../home-partners';

import { _mock } from 'src/_mock';

const SLIDES = [
  {
    id: 1,
    title: 'Banner 1',
    coverUrl: '/banners/Confinement_Banner.png',
  },
  {
    id: 2,
    title: 'Banner 2',
    coverUrl: '/banners/Confinement_Banner_2.png',
  },
  {
    id: 3,
    title: 'Banner 3',
    coverUrl: '/banners/Confinement_Banner_3.png',
  },
];


// ----------------------------------------------------------------------

export function HomeView() {
  const pageProgress = useScrollProgress();

  const { onBackToTop, isVisible } = useBackToTop('90%');

  return (
    <>
      <ScrollProgress
        variant="linear"
        progress={pageProgress.scrollYProgress}
        sx={[(theme) => ({ position: 'fixed', zIndex: theme.zIndex.appBar + 1, top: 0, left: 0, width: '100%' })]}
      />

      <BackToTopButton isVisible={isVisible} onClick={onBackToTop} />

      {/* The carousel banner */}
      <HomeHero data={SLIDES.slice(0, 3)} />

      <Stack
        sx={{
          position: 'relative',
          px: { xs: 1, sm: 2, md: 4 },
          py: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <TopPackages />

        <Benefits />
        <HomeMenu />
        <HomeFeature />
        <HomePopularDish />
        <HomeOrderSteps sx={{ mt: 4 }} />
        <HomePartners sx={{ mt: 4 }} />

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
