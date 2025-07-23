import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { _socials, _paymenttypes } from 'src/_mock';
import { FacebookIcon, InstagramIcon } from 'src/assets/icons';

import { Logo } from 'src/components/logo';
import { dir } from 'i18next';
import { primary } from 'src/theme';
// ----------------------------------------------------------------------

const LINKS = [
  {
    headline: 'Quick Links',
    children: [
      { name: 'Home', href: paths.about },
      { name: 'About us', href: paths.about },
      { name: 'View Weekly Menu', href: paths.about },
      { name: 'Confinement Packages', href: paths.about },
      { name: 'Baby Shower Celebration', href: paths.about },
      { name: 'Articles', href: paths.about },
      { name: 'Testimonials', href: paths.about },
      { name: 'FAQs', href: paths.about },
    ],
  }
];

const INFO = [
  {
    headline: 'Information',
    children: [
      {
        name: 'Hotline/Messenger Hours:',
        info: [
          {
            1: 'Mon - Fri 9:00AM to 6:00PM',
            2: 'Sat: 9:00AM to 12:30PM',
            3: 'Sun, PH Closed'
          },
        ]
      }
    ],
  }
]

// ----------------------------------------------------------------------

const FooterRoot = styled('footer')(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.vars.palette.background.default,
}));

export function Footer({ sx, layoutQuery = 'md', ...other }) {
  const currentYear = new Date().getFullYear();

  return (
    <FooterRoot sx={sx} {...other}>
      <Divider />

      <Container
        sx={(theme) => ({
          pb: 5,
          pt: 10,
          textAlign: 'center',
          [theme.breakpoints.up(layoutQuery)]: { textAlign: 'unset' },
        })}
      >
        <Logo />

        {/* <Typography variant="h6" sx={{ mt: 2 }}>
          Your Custom Footer Title
        </Typography> */}

        <Grid
          container
          sx={[
            (theme) => ({
              mt: 3,
              justifyContent: 'center',
              [theme.breakpoints.up(layoutQuery)]: { justifyContent: 'space-between' },
            }),
          ]}
        >
          <Grid size={{ xs: 12, [layoutQuery]: 3 }} sx={(theme) => ({
            color: theme.vars.palette.primary.main,
          })}>
            <Typography
              variant="body2"
              sx={(theme) => ({
                mx: 'auto',
                maxWidth: 280,
                [theme.breakpoints.up(layoutQuery)]: { mx: 'unset' },
              })}
            >
              3015 Bedok North Street 5, Shimei East Kitchen, #04-21, Singapore 486350
            </Typography>

            <Typography
              variant="body2"
              sx={(theme) => ({
                mx: 'auto',
                maxWidth: 280,
                mt: 1,
                [theme.breakpoints.up(layoutQuery)]: { mx: 'unset' },
              })}
            >
              Phone: 6914 9900
            </Typography>
            <Typography
              variant="body2"
              sx={(theme) => ({
                mx: 'auto',
                maxWidth: 280,
                [theme.breakpoints.up(layoutQuery)]: { mx: 'unset' },
              })}
            >
              Email: confinement@chillipadi.com.sg
            </Typography>
            <Box
              sx={(theme) => ({
                mt: 3,
                mb: 5,
                display: 'flex',
                justifyContent: 'center',
                [theme.breakpoints.up(layoutQuery)]: { mb: 0, justifyContent: 'flex-start' },
              })}
            >
              {_socials.map((social) => (
                <IconButton key={social.label}>
                  {social.value === 'facebook' && <FacebookIcon />}
                  {social.value === 'instagram' && <InstagramIcon />}
                </IconButton>
              ))}
            </Box>
            <Box
              sx={(theme) => ({
                mt: 3,
                mb: 5,
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                alignItems: 'center', // Center image on mobile
                [theme.breakpoints.up(layoutQuery)]: { mb: 0, justifyContent: 'center', alignItems: 'flex-start' },
              })}
            >
              <Typography component="div" variant="overline">
                Affiliates
              </Typography>
              <Image
                src="/logo/Chilli_padi_logo.png"
                alt="Chilli Padi Nonya Catering"
                width={60}
                height={120}
                style={{ objectFit: 'contain' }}
              />
            </Box>

          </Grid>

          <Grid size={{ xs: 12, [layoutQuery]: 6 }}>
            <Box
              sx={(theme) => ({
                gap: 5,
                display: 'flex',
                flexDirection: 'column',
                [theme.breakpoints.up(layoutQuery)]: { flexDirection: 'row' },
              })}
            >
              {LINKS.map((list) => (
                <Box
                  key={list.headline}
                  sx={(theme) => ({
                    gap: 2,
                    width: 1,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    [theme.breakpoints.up(layoutQuery)]: { alignItems: 'flex-start' },
                  })}
                >
                  <Typography component="div" variant="overline" sx={{ color: primary.main }}>
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Link
                      key={link.name}
                      component={RouterLink}
                      href={link.href}
                      color="inherit"
                      variant="body2"
                    >
                      {link.name}
                    </Link>
                  ))}
                </Box>
              ))}
              {INFO.map((list) => (
                <Box
                  key={list.headline}
                  sx={(theme) => ({
                    gap: 2,
                    width: 1,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    [theme.breakpoints.up(layoutQuery)]: { alignItems: 'flex-start' },
                  })}
                >
                  <Typography component="div" variant="overline" sx={{ color: primary.main }}>
                    {list.headline}
                  </Typography>

                  {list.children.map((link) => (
                    <Typography
                      key={link.name}
                      variant="body2"
                      color="inherit"
                      sx={{ mb: 1 }}
                    >
                      {link.name}
                      {link.info &&
                        (Array.isArray(link.info)
                          ? Object.values(link.info[0]).map((item, idx) => (
                            <span key={idx} style={{ display: 'block' }}>{item}</span>
                          ))
                          : <span style={{ display: 'block' }}>{link.info}</span>
                        )
                      }
                    </Typography>
                  ))}
                  <Box
                    sx={(theme) => ({
                      mb: 5,
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 2, // Add gap between images
                      [theme.breakpoints.up(layoutQuery)]: { mb: 0, justifyContent: 'flex-start' },
                    })}
                  >
                    {_paymenttypes.map((payment) => (
                      <Image key={payment.label} src={payment.image} alt={payment.label} width={40} height={40} />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
        <Typography variant="body2" sx={{ mt: 10 }}>
          © {currentYear}{' '}
          <Link
            href="/"
            rel="noopener"
            color="inherit"
            underline="always"
          >
            Confinement Food Delivery | Chilli Padi Confinement
          </Link>
          {' '}
          All Rights Reserved.
        </Typography>
      </Container>
    </FooterRoot >
  );
}
