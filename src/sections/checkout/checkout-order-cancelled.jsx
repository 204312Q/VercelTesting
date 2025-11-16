import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { OrderFailedIllustration } from 'src/assets/illustrations';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CheckoutOrderCancelled({ onResetCart, onTryAgain, ...other }) {
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
                <Typography variant="h4">Payment has been cancelled</Typography>

                <OrderFailedIllustration />

                <Typography color="text.secondary">
                    We couldn't process your payment
                    <br />
                    Please try again
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Button
                        component={RouterLink}
                        href={paths.product.root}
                        size="large"
                        variant="outlined"
                        startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
                    >
                        Go back
                    </Button>

                    {/* {onTryAgain && (
                        <Button
                            onClick={onTryAgain}
                            size="large"
                            variant="contained"
                            startIcon={<Iconify icon="eva:refresh-fill" />}
                        >
                            Try Again
                        </Button>
                    )} */}
                </Box>
            </Box>
        </Dialog>
    );
}