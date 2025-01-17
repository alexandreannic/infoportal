const path = require('path')
const withTM = require('next-transpile-modules')(['enketo-core']);  // Add any other packages here

/** @type {import('next').NextConfig} */
module.exports = withTM({
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'enketo/config': 'enketo-core/config.js',
      'enketo/widgets': 'enketo-core/src/js/widgets.js',
      'enketo/translator': 'enketo-core/src/js/fake-translator',
      'enketo/dialog': 'enketo-core/src/js/fake-dialog',
      'enketo/file-manager': 'enketo-core/src/js/file-manager',
      'enketo/xpath-evaluator-binding': 'enketo-core/src/js/xpath-evaluator-binding',
    };
    return config;
  },
  outputFileTracingRoot: path.join(__dirname, '../../'),
  externalDir: true, swcMinify: true,
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  staticPageGenerationTimeout: 200,
  output: 'standalone',
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
})
