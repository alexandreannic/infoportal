import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  preview: {
    // host: '0.0.0.0',
    port: 3000,
  },
  server: {
    // host: '0.0.0.0',
    port: 3000,
  },
})
