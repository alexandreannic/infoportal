import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  preview: {
    port: 3000,
  },
  server: {
    port: 3000,
  },
  ssr: {
    noExternal: ['@prisma/client'], // or true
  },
  optimizeDeps: {
    exclude: ['@prisma/client'],
  },
})
