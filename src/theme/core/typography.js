import { pxToRem, setFont } from 'minimal-shared/utils';

import { createTheme as getTheme } from '@mui/material/styles';

import { themeConfig } from '../theme-config';

// ----------------------------------------------------------------------

const defaultMuiTheme = getTheme();

function responsiveFontSizes(obj) {
  const breakpoints = defaultMuiTheme.breakpoints.keys;

  return breakpoints.reduce((acc, breakpoint) => {
    const value = obj[breakpoint];

    if (value !== undefined && value >= 0) {
      acc[defaultMuiTheme.breakpoints.up(breakpoint)] = {
        fontSize: pxToRem(value),
      };
    }

    return acc;
  }, {});
}

const primaryFont = setFont(themeConfig.fontFamily.primary);
const secondaryFont = setFont(themeConfig.fontFamily.secondary);

// ----------------------------------------------------------------------

export const typography = {
  fontFamily: primaryFont,
  fontSecondaryFamily: secondaryFont,
  fontWeightLight: 400,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightSemiBold: 500,
  fontWeightBold: 500,
  h1: {
    fontFamily: primaryFont,
    fontWeight: 500, // Medium
    lineHeight: 1.15,
    fontSize: pxToRem(40),
    ...responsiveFontSizes({ sm: 52, md: 58, lg: 64 }),
  },
  h2: {
    fontFamily: primaryFont,
    fontWeight: 500, // Medium
    lineHeight: 1.2,
    fontSize: pxToRem(32),
    ...responsiveFontSizes({ sm: 40, md: 44, lg: 48 }),
  },
  h3: {
    fontFamily: primaryFont,
    fontWeight: 500, // Medium
    lineHeight: 1.3,
    fontSize: pxToRem(24),
    ...responsiveFontSizes({ sm: 26, md: 30, lg: 32 }),
  },
  h4: {
    fontFamily: primaryFont,
    fontWeight: 500, // Medium
    lineHeight: 1.4,
    fontSize: pxToRem(20),
    ...responsiveFontSizes({ md: 24 }),
  },
  h5: {
    fontFamily: primaryFont,
    fontWeight: 500, // Medium
    lineHeight: 1.5,
    fontSize: pxToRem(18),
    ...responsiveFontSizes({ sm: 19 }),
  },
  h6: {
    fontFamily: primaryFont,
    fontWeight: 500, // Medium
    lineHeight: 1.5,
    fontSize: pxToRem(17),
    ...responsiveFontSizes({ sm: 18 }),
  },
  subtitle1: {
    fontFamily: primaryFont,
    fontWeight: 400, // Book
    lineHeight: 1.5,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontFamily: primaryFont,
    fontWeight: 400, // Book
    lineHeight: 1.5,
    fontSize: pxToRem(14),
  },
  body1: {
    fontFamily: secondaryFont,
    fontWeight: 400, // Book
    lineHeight: 1.7,
    fontSize: pxToRem(16),
  },
  body2: {
    fontFamily: secondaryFont,
    fontWeight: 400, // Book
    lineHeight: 1.7,
    fontSize: pxToRem(14),
  },
  caption: {
    fontFamily: secondaryFont,
    fontWeight: 400, // Book
    lineHeight: 1.5,
    fontSize: pxToRem(12),
  },
  overline: {
    fontFamily: secondaryFont,
    fontWeight: 400, // Book
    lineHeight: 1.5,
    fontSize: pxToRem(12),
    textTransform: 'uppercase',
  },
  button: {
    fontFamily: secondaryFont,
    fontWeight: 500, // Medium
    lineHeight: 1.5,
    fontSize: pxToRem(14),
    textTransform: 'unset',
  },
};
