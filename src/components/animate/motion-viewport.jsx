"use client";
import { m } from 'framer-motion';
import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { varContainer } from './variants';

// ----------------------------------------------------------------------

export const MotionViewport = forwardRef((props, ref) => {
  const { children, viewport, disableAnimate = true, ...other } = props;

  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));

  const disabled = smDown && disableAnimate;

  const baseProps = disabled
    ? {}
    : {
      component: m.div,
      initial: 'initial',
      whileInView: 'animate',
      variants: varContainer(),
      viewport: { once: true, amount: 0.3, ...viewport },
    };

  return (
    <Box ref={ref} {...baseProps} {...other}>
      {children}
    </Box>
  );
});
