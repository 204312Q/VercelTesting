'use client';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { _carouselPackages } from 'src/_mock';

import { Image } from 'src/components/image';
import { varFade, MotionViewport } from 'src/components/animate';
import { Carousel, useCarousel, CarouselArrowFloatButtons } from 'src/components/carousel';

// ----------------------------------------------------------------------

export function TopPackages({ sx, ...other }) {
  const carousel = useCarousel({
    align: 'start',
    slideSpacing: '24px',
    slidesToShow: {
      xs: 1,
      sm: 1,
      md: 3,
      lg: 3,
    },
  });

  return (
    <Box
      component="section"
      sx={[{ overflow: 'hidden' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Container component={MotionViewport} sx={{ textAlign: 'center', py: { xs: 3, md: 3 } }}>
        <Typography variant="h2" sx={{ my: 3, color: 'primary.main' }}>
          Top 3 Selling Packages
        </Typography>

        <Box sx={{ position: 'relative' }}>
          <CarouselArrowFloatButtons
            {...carousel.arrows}
            options={carousel.options}
            sx={{
              display: {
                xs: 'flex',  // Show arrows on mobile
                md: 'none',  // Hide arrows on desktop
              },
            }}
          />


          <Carousel carousel={carousel} sx={{ px: 0.5 }}>
            {_carouselPackages.map((pkg) => (
              <Box
                key={pkg.id}
                component={m.div}
                variants={varFade('in')}
                sx={{ py: { xs: 4, md: 5 } }}
              >
                <MemberCard packages={pkg} />
              </Box>
            ))}
          </Carousel>
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="large"
          href={paths.product.root}
          component="a"
          sx={{ minWidth: 240 }}
        >
          Order Now
        </Button>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

function MemberCard({ packages }) {
  return (
    <Card sx={{ pt: 1 }}>
      <Box sx={{ px: 1 }}>
        <Image alt={packages.alt} src={packages.image} ratio="1/1" sx={{ borderRadius: 2 }} />
      </Box>

      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {packages.description}
        </Typography>
        <Typography variant="h6" sx={{ mt: 1, mb: 0.5 }}>
          {packages.name}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2.5, color: 'text.secondary' }}>
          {packages.price}
        </Typography>
      </Box>
    </Card>
  );
}
