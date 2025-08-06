import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { CONFIG } from 'src/global-config';
import { paths } from 'src/routes/paths';
import Typography from '@mui/material/Typography';

export function HomeOrderSteps({ sx, ...other }) {
    return (
        <Box
            component="section"
            sx={[{ position: 'relative', alignItems: 'center', display: 'flex', flexDirection: 'column' }, ...(Array.isArray(sx) ? sx : [sx])]}
            {...other}
        >
            <Typography variant="h2" sx={{ my: 3, color: 'primary.main' }}>
                What's the next step?
            </Typography>
            <Container
                disableGutters
                sx={{
                    position: 'relative',
                    zIndex: 9,
                    height: { xs: 400, md: 500 },
                    backgroundImage: `url(${CONFIG.assetsDir}/assets/background/aboutus.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    borderRadius: 3,
                    overflow: 'hidden',
                    width: '95%',
                }}
            >
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