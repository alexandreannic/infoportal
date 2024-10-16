const path = require('path')

/** @type {import('next').NextConfig} */
module.exports = {
  outputFileTracingRoot: path.join(__dirname, '../../'),
  externalDir: true, swcMinify: true,
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  staticPageGenerationTimeout: 200,
  output: 'standalone',
  experimental: {
    typedRoutes: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: process.env.IGNORE_BUILD_TS_ERRORS === 'true',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}
