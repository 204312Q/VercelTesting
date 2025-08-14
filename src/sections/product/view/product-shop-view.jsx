'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ProductList } from '../product-list';
// import { useProductOrderContext } from '../context'; // Removed

// ----------------------------------------------------------------------

export function ProductShopView({ packages, addons }) {
  // Removed ProductOrderContext dependency since we're handling checkout directly via Stripe

  const productItems = packages || [];
  const addonItems = addons || [];

  return (
    <Container sx={{ mb: 15 }}>
      <Typography
        variant="h2"
        sx={{
          my: { xs: 3, md: 5 },
          textAlign: 'center', // Center the text
          color: 'primary.main' // Use primary color
        }}
      >
        Our Packages
      </Typography>

      <ProductList packages={productItems} addons={addonItems} />

    </Container>
  );
}