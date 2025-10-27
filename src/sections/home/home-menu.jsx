import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';


export function HomeMenu({ sx, ...other }) {
  return (
    <Box
      component="section"
      sx={[{ position: 'relative' }, ...(Array.isArray(sx) ? sx : [sx])]}
      {...other}
    >
      <Container
        disableGutters
        sx={{
          position: 'relative',
          zIndex: 9,
          height: { xs: 400, md: 500 },
          width: '95%',
          backgroundImage: `url(${CONFIG.assetsDir}/assets/background/Confinement_menu.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            left: 24,
            bottom: 24,
            zIndex: 10,
          }}
        >
          <Button
            color="primary"
            size="large"
            variant="contained"
            target="_blank"
            rel="noopener"
            href={paths.minimalStore}
            component="a"
            sx={{ minWidth: 240 }}
          >
            View Menu &gt;
          </Button>
        </Box>
      </Container>
    </Box>
  );
}