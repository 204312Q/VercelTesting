'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { FaqsList } from '../faqs-list';
import { _faqs } from 'src/_mock/_others';

// ----------------------------------------------------------------------

export function FaqsView() {
  return (
    <>
      <Box sx={{ py: 5 }}>
        <Container component="section" sx={{ position: 'relative', pb: 10 }}>
          <Typography
            variant="h3"
            sx={{
              my: 5,
              color: 'primary.main',
            }}
          >
            Frequently asked questions
          </Typography>
          <FaqsList contents={_faqs} />
        </Container>
      </Box>
    </>
  );
}
