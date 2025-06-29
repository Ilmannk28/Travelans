import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'src/public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
  VitePWA({
    registerType: 'autoUpdate',
    injectManifest: {
      swSrc: resolve(__dirname, 'src/public/sw.js'),
      swDest: 'sw.js',
      globDirectory: resolve(__dirname, 'dist'),
      globPatterns: [
        '**/*.{html,js,css,png,webmanifest}'
      ],
    },
  })
]
});