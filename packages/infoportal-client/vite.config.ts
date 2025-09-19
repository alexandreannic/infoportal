import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['fs', 'stream'],
    },
  },
  server: {
    port: 3000,
  },
  preview: {
    // host: '0.0.0.0',
    port: 3000,
  },
})
