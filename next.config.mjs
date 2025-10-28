/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,

  env: {
    BUILD_STATIC_EXPORT: 'false',
  },

  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },

  // ✅ This is the ONLY valid output mode for Prisma + API routes
  output: 'standalone',
};
export default nextConfig;
