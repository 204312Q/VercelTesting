'use client';

import Box from '@mui/material/Box';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

export function AboutHero({ sx, ...other }) {
  return (
    <Box
      component="section"
      sx={[
        (theme) => ({
          ...theme.mixins.bgGradient({
            images: [
              `url(${CONFIG.assetsDir}/assets/background/overlay.png)`,
              `url(${CONFIG.assetsDir}/aboutUs/cpc-dish.png)`,
            ],
          }),
          height: { md: 560 },
          py: { xs: 10, md: 0 },
          overflow: 'hidden',
          position: 'relative',
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
    </Box>
  );
}
