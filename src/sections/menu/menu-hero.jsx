'use client';
import Box from '@mui/material/Box';
import Image from 'next/image';
import { useMediaQuery, useTheme } from '@mui/material';

// ----------------------------------------------------------------------

export function MenuHero({ sx, ...other }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box
            component="section"
            sx={{
                width: '100vw',
                position: 'relative',
                left: '50%',
                right: '50%',
                marginLeft: '-50vw',
                marginRight: '-50vw',
                pb: { xs: 4, md: 8 },
                bgcolor: 'white',
                overflow: 'hidden',
                ...sx,
            }}
            {...other}
        >
            {/* Top Image */}
            <Box
                sx={{
                    width: '100vw',
                    height: { xs: 300, sm: 350, md: 650 }, // Increased all heights
                    position: 'relative',
                    borderRadius: 0,
                    overflow: 'hidden',
                }}
            >
                <Image
                    src={isMobile
                        ? "/banners/Confinement_Menu_Banner_Mobile.avif" // Create a mobile version
                        : "/banners/Confinement_Menu_Banner.avif" // Desktop version
                    }
                    alt="Dish Banner"
                    fill
                    style={{
                        objectFit: 'cover',
                        objectPosition: 'center',
                        width: '100%',
                        height: '100%',
                    }}
                    sizes="100vw"
                />
            </Box>
        </Box>
    );
}