import {defineConfig} from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  minify: false,
  splitting: true,
  sourcemap: true,
  clean: true,
  keepNames: true,
  treeshake: true,
})
