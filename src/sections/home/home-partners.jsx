import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Partner data
const partners = [
    { id: 1, src: '/assets/partners/partner-1.avif', alt: 'bbyeol' },
    { id: 2, src: '/assets/partners/partner-2.avif', alt: 'Beauty Mum & Babies' },
    { id: 3, src: '/assets/partners/partner-3.avif', alt: 'Mount Alvernia Hospital' },
    { id: 4, src: '/assets/partners/partner-4.avif', alt: 'Mummies Club' },
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
            <PartnersList data={partners} />
        </Box>
    );
}

function PartnersList({ data }) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 3,
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: 1200, // Limit container width
                mx: 'auto',
            }}
        >
            {data.map((item) => (
                <PartnerItem key={item.id} item={item} />
            ))}
        </Box>
    );
}

function PartnerItem({ item }) {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: { xs: 120, sm: 150, md: 180 }, // Responsive width
                height: { xs: 80, sm: 100, md: 120 }, // Responsive height
                p: 2,
                borderRadius: 2,
            }}
        >
            <Box
                component="img"
                alt={item.alt}
                src={item.src}
                sx={{
                    objectFit: 'contain',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    // Force minimum size for smaller images
                    minWidth: { xs: 80, sm: 100, md: 120 },
                    minHeight: { xs: 50, sm: 60, md: 70 },
                }}
            />
        </Box>
    );
}