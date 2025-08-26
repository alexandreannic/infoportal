import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'demo'),
  resolve: {
    alias: {
      '@infoportal/datatable': path.resolve(__dirname, 'src'),
    },
  },
})
