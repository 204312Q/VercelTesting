'use client';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { _carouselBenefits } from 'src/_mock';

import { Image } from 'src/components/image';
import { varFade, MotionViewport } from 'src/components/animate';
import { Carousel, useCarousel, CarouselArrowFloatButtons } from 'src/components/carousel';

// ----------------------------------------------------------------------

export function Benefits({ sx, ...other }) {
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
          Why Choose Us?
        </Typography>

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
              {_carouselBenefits.map((b) => (
                <Box
                  key={b.id}
                  component={m.div}
                  variants={varFade('up')}
                  sx={{ py: { xs: 4, md: 5 } }}
                >
                  <MemberCard benefits={b} />
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

function MemberCard({ benefits }) {
  return (
    <Card sx={{ pt: 1, height: 540 }}>
      <Box sx={{ px: 1 }}>
        <Image
          alt={benefits.alt}
          src={benefits.image}
          sx={{
            borderRadius: 2,
            objectFit: benefits.size,
            width: '100%',
            height: 'auto',
            display: 'block',
            maxHeight: { xs: 250, md: 300 },
          }}
        />
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
        <Typography variant="h6" sx={{ mt: 1, mb: 0.5 }}>
          {benefits.name}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {benefits.description}
        </Typography>
      </Box>
    </Card>
  );
}
