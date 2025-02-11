import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: 'named',
      },
      include: '**/*.svg',
    }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      components: path.resolve(__dirname, './src/components'),
    },
  },
  build: {
    outDir: '../dist',
  },
})
