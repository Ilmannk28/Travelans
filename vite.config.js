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
      includeAssets: ['favicon.png', 'icon-192x192.png', 'icon-512x512.png'],
      // Gunakan manifest eksternal
      manifestFilename: 'manifest.webmanifest',
      useCredentials: true,
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
            },
          },
        ],
      }
    })
  ]
});