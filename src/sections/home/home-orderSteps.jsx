import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { CONFIG } from 'src/global-config';
import { paths } from 'src/routes/paths';

// Order steps data with your images
const orderSteps = [
    {
        id: 1,
        image: "/assets/OrderSteps/OrderStep-1.webp",
    },
    {
        id: 2,
        image: "/assets/OrderSteps/OrderStep-2.webp",
    },
    {
        id: 3,
        image: "/assets/OrderSteps/OrderStep-3.webp",
    }
];

export function HomeOrderSteps({ sx, ...other }) {
    return (
        <Box
            component="section"
            sx={[
                {
                    position: 'relative',
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    py: 6
                },
                ...(Array.isArray(sx) ? sx : [sx])
            ]}
            {...other}
        >
            <Typography variant="h2" sx={{ my: 3, color: 'primary.main', textAlign: 'center' }}>
                What's the next step?
            </Typography>

            <Container sx={{ mb: 4 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: { xs: 'column', md: 'row' },
                    }}
                >
                    {orderSteps.map((step, index) => (
                        <Box key={step.id} sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: { xs: 'column', md: 'row' }
                        }}>
                            <Box
                                component="img"
                                src={step.image}
                                alt={`Step ${step.id}`}
                                sx={{
                                    width: { xs: 280, md: 320 },
                                    height: 'auto',
                                    objectFit: 'contain',
                                    borderRadius: 2,
                                    boxShadow: 3,
                                }}
                            />

                            {/* Thicker Connector Line */}
                            {index < orderSteps.length - 1 && (
                                <Box
                                    sx={{
                                        width: { xs: '6px', md: '80px' },
                                        height: { xs: '40px', md: '6px' },
                                        backgroundColor: 'primary.main',
                                        mx: { xs: 0, md: 0 },
                                        my: { xs: 0, md: 0 },
                                    }}
                                />
                            )}
                        </Box>
                    ))}
                </Box>
            </Container>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 3 }}>
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
            </Box>
        </Box>
    );
}