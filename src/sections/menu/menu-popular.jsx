'use client';
import { m } from 'framer-motion';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useMediaQuery } from '@mui/material';

import { _carouselPopularDish } from 'src/_mock';

import { Image } from 'src/components/image';
import { varFade, MotionViewport } from 'src/components/animate';
import { Carousel, useCarousel, CarouselArrowFloatButtons } from 'src/components/carousel';
import { ConfirmDialog } from 'src/components/custom-dialog/confirm-dialog';
// ----------------------------------------------------------------------

export function MenuPopular({ sx, ...other }) {

    const isMobile = useMediaQuery(theme => theme.breakpoints.down('sm'));

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

    // Add state for dialog
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);

    const handleOpen = (dish) => {
        setSelected(dish);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelected(null);
    };

    return (
        <Box component="section" sx={[{ overflow: 'hidden' }, ...(Array.isArray(sx) ? sx : [sx])]} {...other}>
            <Container component={MotionViewport} sx={{ textAlign: 'center', py: { xs: 3, md: 3 } }}>
                <Typography variant="h2" sx={{ my: 3, color: 'primary.main' }}>
                    Our Popular Dishes
                </Typography>
                <Box sx={{ position: 'relative' }}>
                    <CarouselArrowFloatButtons
                        {...carousel.arrows}
                        options={carousel.options}
                        sx={{
                            display: {
                                xs: 'flex',
                                md: 'none',
                            },
                        }}
                    />
                    <Carousel carousel={carousel} sx={{ px: 0.5 }}>
                        {_carouselPopularDish.map((pd, idx) => (
                            <Box
                                key={pd.id}
                                component={m.div}
                                variants={isMobile ? undefined : varFade('inUp')}
                                transition={isMobile ? undefined : { delay: idx * 0.2 }}
                                sx={{ py: { xs: 4, md: 5 }, cursor: 'pointer' }}
                                onClick={() => handleOpen(pd)}
                            >
                                <MemberCard popular={pd} />
                            </Box>
                        ))}
                    </Carousel>
                </Box>
            </Container>
            <ConfirmDialog
                open={open}
                onClose={handleClose}
                title={selected?.name}
                content={
                    <>
                        {selected?.description}
                        {selected?.chineseName && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    {selected.chineseName}
                                </Typography>
                            </Box>
                        )}
                        {selected?.chineseDescription && (
                            <Box sx={{ mt: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    {selected.chineseDescription}
                                </Typography>
                            </Box>
                        )}
                    </>
                }
            />
        </Box>
    );
}

// ----------------------------------------------------------------------

function MemberCard({ popular }) {
    return (
        <Box>
            <Box sx={{ px: 1, maxWidth: { xs: 200, md: 'none' }, mx: { xs: 'auto', md: 'initial' } }}>
                <Image
                    alt={popular.alt}
                    src={popular.image}
                    ratio="1/1"
                    sx={{
                        borderRadius: 2,
                        maxHeight: { xs: 180, md: 'none' }, // Limit height on mobile only
                        objectFit: { xs: 'contain', md: 'cover' }, // Use contain on mobile, cover on desktop
                    }}
                />
            </Box>

            <Box
                sx={{
                    p: { xs: 1.5, md: 2 }, // Smaller padding on mobile
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                }}
            >
                <Typography variant="h6" sx={{ mt: { xs: 0.5, md: 1 }, mb: 0.5, fontSize: { xs: '0.9rem', md: '1.25rem' } }}>
                    {popular.name}
                </Typography>
            </Box>
        </Box>
    );
}
