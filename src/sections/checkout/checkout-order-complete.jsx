import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { OrderCompleteIllustration } from 'src/assets/illustrations';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function CheckoutOrderComplete({ onResetCart, onDownloadPDF, ...other }) {
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
          gap: 5,
          m: 'auto',
          maxWidth: 480,
          display: 'flex',
          textAlign: 'center',
          alignItems: 'center',
          px: { xs: 2, sm: 0 },
          flexDirection: 'column',
        }}
      >
        <Typography variant="h4">Thank you for your purchase!</Typography>

        <OrderCompleteIllustration />

        <Typography>
          An email confirmation will be sent to you once your order is processed.
          <br /> Please check your email for any updates.
        </Typography>

        <Divider sx={{ width: 1, borderStyle: 'dashed' }} />

        <Box
          sx={{
            gap: 2,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <Button
            component={RouterLink}
            href="/"
            size="large"
            color="inherit"
            variant="outlined"
            onClick={onResetCart}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Go to Home
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
