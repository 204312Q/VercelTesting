'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Image from 'next/image';

// ----------------------------------------------------------------------

export function AboutViewPackage({ sx, ...other }) {
    return (
        <Box
            component="section"
            sx={[
                () => ({
                    minHeight: { md: 600 },
                    py: { xs: 5, md: 6 },
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                }),
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
            {...other}
        >
            <Container
                maxWidth="lg"
                sx={{
                    maxWidth: { xs: '100%', sm: '85%', md: '1200px' }, // Increased desktop width
                    px: { xs: 1, sm: 2, md: 3 }
                }}
            >
                <Grid
                    container
                    spacing={{ xs: 0, md: 1 }} // Reduced spacing from 2 to 1
                    alignItems="center"
                    justifyContent="center"
                    sx={{ minHeight: { md: 350 } }}
                >
                    {/* Image Section */}
                    <Grid item xs={12} md={6}> {/* Back to 6 for larger sections */}
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: { xs: 'center', md: 'flex-end' }, // Align right on desktop
                                alignItems: 'center',
                                height: { xs: 'auto', md: '100%' },
                                mb: { xs: 4, md: 0 },
                                px: { xs: 0, md: 0.5 }, // Minimal padding
                            }}
                        >
                            <Box
                                sx={{
                                    width: { xs: '90%', sm: '80%', md: '100%' }, // Increased widths
                                    maxWidth: { xs: 320, md: 550 }, // Even larger max width for desktop
                                }}
                            >
                                <Image
                                    src="/aboutUs/confinementPackage.avif"
                                    alt="Confinement Package"
                                    width={600} // Increased from 500
                                    height={450} // Increased from 375
                                    style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        borderRadius: 12,
                                    }}
                                />
                            </Box>
                        </Box>
                    </Grid>

                    {/* Content Section */}
                    <Grid item xs={12} md={6}> {/* Back to 6 for larger sections */}
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center', // Always center align
                                height: { xs: 'auto', md: '100%' },
                                textAlign: 'center', // Always center text
                                px: { xs: 2, md: 0.5 }, // Minimal padding
                            }}
                        >
                            <Typography
                                variant="h3"
                                sx={{
                                    fontWeight: 'bold',
                                    mb: { xs: 1.5, md: 2 },
                                    color: '#f27b96',
                                    fontSize: { xs: '1.75rem', md: '2.25rem' },
                                    lineHeight: { xs: 1.2, md: 1.3 },
                                }}
                            >
                                Convenience and Quality
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    mb: { xs: 2.5, md: 3 },
                                    lineHeight: 1.7,
                                    fontSize: { xs: '0.95rem', md: '1rem' },
                                    color: 'text.secondary',
                                    maxWidth: 380,
                                }}
                            >
                                Our thermal wares deliver warm, nutritious meals straight to your doorstep.
                                <br /><br />
                                Skip meal prep, cooking, and cleaning—spend quality time with your newborn while we take care of your well-being.
                            </Typography>

                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: '#f27b96',
                                    color: 'white',
                                    px: { xs: 3, md: 4 },
                                    py: { xs: 1.2, md: 1.5 },
                                    borderRadius: 2,
                                    fontSize: { xs: '1rem', md: '1.1rem' },
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                    minWidth: { xs: 140, md: 160 },
                                    '&:hover': {
                                        backgroundColor: '#e26782',
                                    },
                                }}
                            >
                                View Packages
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}