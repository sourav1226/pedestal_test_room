import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@components/common', replacement: path.resolve(__dirname, 'src/components/admin-common') },
      { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
      { find: '@pages', replacement: path.resolve(__dirname, 'src/pages') },
      { find: '@services', replacement: path.resolve(__dirname, 'src/services') },
      { find: '@hooks', replacement: path.resolve(__dirname, 'src/hooks') },
      { find: '@utils', replacement: path.resolve(__dirname, 'src/utils') },
      { find: '@constants', replacement: path.resolve(__dirname, 'src/constants') },
      { find: '@types', replacement: path.resolve(__dirname, 'src/types') },
      { find: '@mock', replacement: path.resolve(__dirname, 'src/mock') },
      { find: '@store', replacement: path.resolve(__dirname, 'src/store') },
      { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
