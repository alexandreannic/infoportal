import * as path from 'path'
import {PrismaPlugin} from '@prisma/nextjs-monorepo-workaround-plugin'
import {fileURLToPath} from 'url'

// Resolve `__dirname` equivalent in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default {
  entry: './src/index.ts',
  target: 'node',
  plugins: [new PrismaPlugin()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  resolve: {
    extensionAlias: {
      '.js': ['.js', '.ts'],
    },
    fullySpecified: false,
    extensions: ['.ts', '.js'],
  },
  output: {
    module: true,
    libraryTarget: 'module',
    filename: 'bundle.mjs',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  experiments: {
    outputModule: true,
  },
  externalsType: 'module',
  externals: {
    '@prisma/client': '@prisma/client',
  },
}
