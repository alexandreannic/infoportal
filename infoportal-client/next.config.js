const path = require('path')

/** @type {import('next').NextConfig} */
module.exports = {
  swcMinify: true,
  productionBrowserSourceMaps: true,
  reactStrictMode: true,
  staticPageGenerationTimeout: 200,
  output: 'standalone',
  transpilePackages: ['mui-extension', 'enketo-core'],
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
  webpack: (config, context) => {
    //   console.log('=========', path.resolve(__dirname, 'enketo-config'))
    config.resolve.alias = {
      ...config.resolve.alias,
      'enketo/config': path.resolve(__dirname, 'enketo-config'),
      'enketo/translator': path.resolve(__dirname + 'enketo-translator'),
      'libxslt': false,

      //     "enketo/widgets": root + "widgets.js",
      //     "enketo/dialog": root + "fake-dialog",
      //     "enketo/file-manager": root + "file-manager",
      //     "enketo/xpath-evaluator-binding": root + "xpath-evaluator-binding"
    }
    return config
  }
}
