'use client';

import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { _carouselPromotion } from 'src/_mock';

import { Image } from 'src/components/image';
import { varFade, MotionViewport } from 'src/components/animate';
import { Carousel, useCarousel, CarouselArrowFloatButtons } from 'src/components/carousel';
// import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export function HomeFeature({ sx, ...other }) {
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

        <m.div variants={varFade('inUp')} initial="initial" whileInView="animate" viewport={{ once: true }}>
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
              {_carouselPromotion.map((p) => (
                <Box
                  key={p.id}
                  component={m.div}
                  variants={varFade('up')}
                  sx={{ py: { xs: 4, md: 5 } }}
                >
                  <MemberCard feature={p} />
                </Box>
              ))}
            </Carousel>
          </Box>
        </m.div>
      </Container>
    </Box>
  );
}

// ----------------------------------------------------------------------

function MemberCard({ feature }) {
  return (
    <Card sx={{ pt: 1, height: 670, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 1 }}>
        <Image alt={feature.alt} src={feature.image} ratio="1/1" sx={{ borderRadius: 2 }} />
      </Box>

      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'column',
          flex: 1, // Takes remaining space
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mt: 1, mb: 0.5 }}>
            {feature.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
            {feature.description}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          href={feature.url}
          component="a"
          sx={{ minWidth: 240, mt: 'auto' }}
        >
          View More
        </Button>
      </Box>
    </Card>
  );
}