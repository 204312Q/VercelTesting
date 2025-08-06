import AutoScroll from 'embla-carousel-auto-scroll';
import Box from '@mui/material/Box';
import { Carousel, useCarousel } from 'src/components/carousel';

import Typography from '@mui/material/Typography';

// Partner data
const partners = [
    { id: 1, src: '/assets/partners/partner-1.avif', alt: 'bbyeol' },
    { id: 2, src: '/assets/partners/partner-2.avif', alt: 'Beauty Mum & Babies' },
    { id: 3, src: '/assets/partners/partner-3.webp', alt: 'Mount Alvernia Hospital' },
    { id: 4, src: '/assets/partners/partner-4.webp', alt: 'Mummies Club' },
    { id: 5, src: '/assets/partners/partner-5.avif', alt: 'Queen' },
];

// ----------------------------------------------------------------------

export function HomePartners({ sx, ...other }) {
    return (
        <Box
            component="section"
            sx={[
                { py: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' },
                ...(Array.isArray(sx) ? sx : [sx])
            ]}
            {...other}
        >
            <Typography variant="h2" sx={{ my: 3, color: 'primary.main', textAlign: 'center' }}>
                Partners
            </Typography>
            <CarouselAutoScroll data={partners} />
        </Box>
    );
}

export function CarouselAutoScroll({ data }) {
    const carousel = useCarousel(
        { loop: true },
        [AutoScroll({ playOnInit: true, stopOnInteraction: false })]
    );
    return (
        <Box sx={{ position: 'relative', width: 350, mx: 'auto', overflow: 'hidden' }}>
            <Carousel carousel={carousel} sx={{ borderRadius: 2, overflow: 'visible' }}>
                {data.map((item) => (
                    <CarouselItem key={item.id} item={item} />
                ))}
            </Carousel>
        </Box>
    );
}

function CarouselItem({ item }) {
    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 200, // fixed width for each slide
                flexShrink: 0, // prevent shrinking
                boxSizing: 'border-box',
                height: '100%', // fixed height for each slide
            }}
        >
            <Box
                component="img"
                alt={item.alt}
                src={item.src}
                sx={{ objectFit: 'contain', width: 200, height: 'auto' }}
            />
        </Box>
    );
}