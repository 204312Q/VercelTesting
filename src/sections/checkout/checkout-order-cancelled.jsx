import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { OrderFailedIllustration } from 'src/assets/illustrations';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CheckoutOrderCancelled({ onResetCart, ...other }) {
    return (
        <Dialog
            fullWidth
            fullScreen
            PaperProps={{
                sx: {
                    width: { md: `calc(100% - 48px)` },
                    height: { md: `calc(100% - 48px)` },
                },
            }}
            {...other}
        >
            <Box
                sx={{
                    py: 5,
                    m: 'auto',
                    maxWidth: 480,
                    display: 'flex',
                    textAlign: 'center',
                    alignItems: 'center',
                    px: { xs: 2, sm: 0 },
                    flexDirection: 'column',
                    gap: 3,
                }}
            >
                <Typography variant="h4">Something went wrong!</Typography>

                <OrderFailedIllustration />

                <Typography color="text.secondary">
                    We can&apos;t process your order at this time.
                    <br />
                    Please try again or contact support if the problem persists.
                </Typography>

                <Button
                    component={RouterLink}
                    href={paths.product.root}
                    size="large"
                    variant="contained"
                    onClick={onResetCart}
                    startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                    sx={{ mt: 2 }}
                >
                    Continue Shopping
                </Button>
            </Box>
        </Dialog>
    );
}