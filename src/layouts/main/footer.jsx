import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid2';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Image from 'next/image';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { _socials, _paymenttypes } from 'src/_mock';
import { FacebookIcon, InstagramIcon, TiktokIcon } from 'src/assets/icons';
import { primary } from 'src/theme';

import { Logo } from 'src/components/logo';


// ----------------------------------------------------------------------

const BehindTheBrand = [
  {
    headline: 'Behind The Brand',
    children: [
      { name: 'Home', href: paths.about },
      { name: 'About us', href: paths.about },
      { name: 'Articles', href: paths.about },
      { name: 'Testimonials', href: paths.about },
    ],
  },
]

const ComfortForMum = [
  {
    headline: 'Comfort For Mum',
    children: [
      { name: 'View Weekly Menu', href: paths.about },
      { name: 'Confinement Packages', href: paths.about },
      { name: 'Baby Shower Celebration', href: paths.about },
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
        {/* <Typography variant="h6" sx={{ mt: 2 }}>
          Your Custom Footer Title
        </Typography> */}
        <Grid
          container
          sx={[
            (theme) => ({
              mt: 1,
              justifyContent: 'center',
              alignItems: 'flex-start',
              [theme.breakpoints.up(layoutQuery)]: { justifyContent: 'space-between' },
            }),
          ]}
        >
          {/* Column 1: Logo + Contact Info */}
          <Grid size={{ xs: 12, [layoutQuery]: 4 }} sx={(theme) => ({
            color: theme.vars.palette.primary.main,
          })}>
            <Logo sx={{ width: 150, height: 'auto' }} />

            <Typography variant="body2" sx={(theme) => ({
              mx: 'auto', maxWidth: 280, mt: 2,
              [theme.breakpoints.up(layoutQuery)]: { mx: 'unset' },
            })}>
              3015 Bedok North Street 5, Shimei East Kitchen, #04-21, Singapore 486350
            </Typography>

            <Typography variant="body2" sx={(theme) => ({
              mx: 'auto', maxWidth: 280, mt: 1,
              [theme.breakpoints.up(layoutQuery)]: { mx: 'unset' },
            })}>
              Phone: 6914 9900
            </Typography>

            <Typography variant="body2" sx={(theme) => ({
              mx: 'auto', maxWidth: 280,
              [theme.breakpoints.up(layoutQuery)]: { mx: 'unset' },
            })}>
              Email: confinement@chillipadi.com.sg
            </Typography>

            {/* Social Icons */}
            <Box sx={(theme) => ({
              mt: 3, mb: 5, display: 'flex', justifyContent: 'center',
              [theme.breakpoints.up(layoutQuery)]: { mb: 0, justifyContent: 'flex-start' },
            })}>
              {_socials.map((social) => (
                <IconButton key={social.label} component="a" href={social.href} target="_blank">
                  {social.value === 'facebook' && <FacebookIcon />}
                  {social.value === 'instagram' && <InstagramIcon />}
                  {social.value === 'tiktok' && <TiktokIcon />}
                </IconButton>
              ))}
            </Box>

            {/* Affiliates */}
            <Box sx={(theme) => ({
              mt: 3, mb: 5, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center',
              [theme.breakpoints.up(layoutQuery)]: { mb: 0, alignItems: 'flex-start' },
            })}>
              <Typography component="div" variant="h6">Affiliates</Typography>
              <Image src="/logo/Chilli_padi_logo.png" alt="Chilli Padi Nonya Catering" width={80} height={120} style={{ objectFit: 'contain' }} />
            </Box>
          </Grid>

          {/* Column 2: Links + Information (Combined) */}
          <Grid size={{ xs: 12, [layoutQuery]: 8 }}>
            <Box sx={(theme) => ({
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              [theme.breakpoints.up(layoutQuery)]: {
                flexDirection: 'row',
                justifyContent: 'space-between'
              },
            })}>

              {/* Behind The Brand */}
              <Box sx={{ flex: 1 }}>
                {BehindTheBrand.map((list) => (
                  <Box key={list.headline} sx={(theme) => ({
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    [theme.breakpoints.up(layoutQuery)]: { alignItems: 'flex-start' },
                  })}>
                    <Typography component="div" variant="h6" sx={{ color: primary.main, mb: 2 }}>
                      {list.headline}
                    </Typography>

                    <Box sx={(theme) => ({
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      alignItems: 'center',
                      [theme.breakpoints.up(layoutQuery)]: { alignItems: 'flex-start' },
                    })}>
                      {list.children.map((link) => (
                        <Link key={link.name} component={RouterLink} href={link.href} color="inherit" variant="body2">
                          {link.name}
                        </Link>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Comfort For Mum */}
              <Box sx={{ flex: 1 }}>
                {ComfortForMum.map((list) => (
                  <Box key={list.headline} sx={(theme) => ({
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    [theme.breakpoints.up(layoutQuery)]: { alignItems: 'flex-start' },
                  })}>
                    <Typography component="div" variant="h6" sx={{ color: primary.main, mb: 2 }}>
                      {list.headline}
                    </Typography>

                    <Box sx={(theme) => ({
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      alignItems: 'center',
                      [theme.breakpoints.up(layoutQuery)]: { alignItems: 'flex-start' },
                    })}>
                      {list.children.map((link) => (
                        <Link key={link.name} component={RouterLink} href={link.href} color="inherit" variant="body2">
                          {link.name}
                        </Link>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Information */}
              <Box sx={{ flex: 1 }}>
                {INFO.map((list) => (
                  <Box key={list.headline} sx={(theme) => ({
                    gap: 2, display: 'flex', alignItems: 'center', flexDirection: 'column',
                    [theme.breakpoints.up(layoutQuery)]: { alignItems: 'flex-start' },
                  })}>
                    <Typography component="div" variant="h6" sx={{ color: primary.main }}>
                      {list.headline}
                    </Typography>
                    {list.children.map((link) => (
                      <Typography key={link.name} variant="body2" color="inherit" sx={{ mb: 1 }}>
                        {link.name}
                        {link.info && (Array.isArray(link.info)
                          ? Object.entries(link.info[0]).map(([key, item]) => (
                            <span key={key} style={{ display: 'block' }}>{item}</span>
                          ))
                          : <span style={{ display: 'block' }}>{link.info}</span>
                        )}
                      </Typography>
                    ))}
                    <Box sx={(theme) => ({
                      mb: 5, display: 'flex', justifyContent: 'center', gap: 2,
                      [theme.breakpoints.up(layoutQuery)]: { mb: 0, justifyContent: 'flex-start' },
                    })}>
                      {_paymenttypes.map((payment) => (
                        <Image key={payment.id} src={payment.image} alt={payment.value} width={40} height={40} />
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>

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
