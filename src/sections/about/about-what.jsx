'use client';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { m } from 'framer-motion';
import { varFade, MotionViewport } from 'src/components/animate';

export function AboutWhat({ sx, ...other }) {
  return (
    <Box
      component="section"
      sx={[
        {
          position: 'relative',
          width: '100vw',
          left: '50%',
          right: '50%',
          marginLeft: '-50vw',
          marginRight: '-50vw',
          height: { xs: 800, md: 650 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          bgcolor: 'transparent',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(/aboutUs/owner2.avif)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
        }}
      />
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.2)',
          zIndex: 2,
        }}
      />
      {/* Centered Card */}
      <Container
        component={MotionViewport}
        sx={{
          position: 'relative',
          zIndex: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'flex-start' }, // Center on mobile, left on desktop
          height: '100%',
          maxWidth: 'lg',
        }}
      >
        <Box
          sx={[
            (theme) => ({
              backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white
              backdropFilter: 'blur(20px)', // Glass effect
              WebkitBackdropFilter: 'blur(20px)', // Safari support
              borderRadius: 2,
              p: { xs: 3, md: 4 },
              maxWidth: 700,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', // Soft shadow
              textAlign: 'left',
              width: { xs: '90%', sm: 550, md: 650 },
            }),
          ]}
        >
          <Typography
            component={m.p}
            variants={varFade('inUp')}
            sx={{
              color: 'common.white', // Changed from 'text.secondary' to match testimonial
              fontSize: { xs: 14, md: 16 },
              lineHeight: 1.6,
            }}
          >
            Chilli Padi started off as a restaurant which was founded in 1997 and has been synonymous with authentic Peranakan Cuisine, rich heritage and gourmet excellence. We have since built an island-wide footprint with our catering arm, flagship restaurant and chain of cafeterias, collectively known as Chilli Padi Holding.
            <br /><br />
            Over the years, Chilli Padi has received numerous accolades including the coveted Singapore's Best Restaurant by Singapore Tatler, Asia Pacific Brands Award and Promising SME500, among others. In particular, the Singapore Tourism Board proudly recommends the international media to Chilli Padi's cuisine as a fine exemplary of Singapore's rich food heritage.
            <br /><br />
            In 2011, we initially offered our confinement meals at our restaurant. Encouraged by the positive response and demand for our meals, we expanded our portfolio to cater confinement meal catering service aimed to aid mummies in their postpartum recovery.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}