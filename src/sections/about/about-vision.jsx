'use client';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export function AboutVision({ sx, ...other }) {

  return (
    <Box
      component="section"
      sx={[
        {
          pt: { xs: 10, md: 15 },
          pb: { xs: 5, md: 5 },
        },
        ...(Array.isArray(sx) ? sx : [sx])
      ]}
      {...other}
    >
      <Container component={MotionViewport}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
          }}
        >
          <Typography
            component={m.h2}
            variants={varFade('inUp')}
            variant="h2"
            sx={{
              color: 'primary.main',
              fontWeight: 'bold',
              maxWidth: 800,
              mx: 'auto'
            }}
          >
            Trusted By Mothers Since 2011
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}