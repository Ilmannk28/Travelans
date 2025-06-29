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
      strategies: 'injectManifest',
      swSrc: resolve(__dirname, 'src/public/sw.js'),
      swDest: 'sw.js',
      manifest: {
        name: 'Travellans App',
        short_name: 'Travellans',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#3f51b5',
        lang: 'id',
        icons: [
          { src: "images/icons/icon-512x512.png", type: "image/png", sizes: "512x512", purpose: "any" },
          { src: "images/icons/icon-192x192.png", type: "image/png", sizes: "192x192", purpose: "any" },
          { src: "images/icons/icon-x144.png", type: "image/png", sizes: "144x144", purpose: "any" },
          { src: "images/icons/maskable-icon-x48.png", type: "image/png", sizes: "48x48", purpose: "maskable" },
          { src: "images/icons/maskable-icon-x96.png", type: "image/png", sizes: "96x96", purpose: "maskable" },
          { src: "images/icons/maskable-icon-x192.png", type: "image/png", sizes: "192x192", purpose: "maskable" },
          { src: "images/icons/maskable-icon-x384.png", type: "image/png", sizes: "384x384", purpose: "maskable" },
          { src: "images/icons/maskable-icon-x512.png", type: "image/png", sizes: "512x512", purpose: "maskable" }
        ],
        screenshots: [
          { src: "images/screenshots/Travellans01.png", sizes: "1920x1080", type: "image/png", form_factor: "wide" },
          { src: "images/screenshots/Travellans02.png", sizes: "1920x1080", type: "image/png", form_factor: "wide" },
          { src: "images/screenshots/Travellans03.png", sizes: "1920x1080", type: "image/png", form_factor: "wide" },
          { src: "images/screenshots/Travellans04.png", sizes: "1080x2280", type: "image/png", form_factor: "narrow" },
          { src: "images/screenshots/Travellans05.png", sizes: "1080x2280", type: "image/png", form_factor: "narrow" },
          { src: "images/screenshots/Travellans06.png", sizes: "1080x2280", type: "image/png", form_factor: "narrow" }
        ],
        shortcuts: [
          {
            name: "Laporan Baru",
            short_name: "Laporan",
            description: "Buat laporan baru",
            url: "/laporan",
            icons: [{ src: "images/icons/maskable-icon-x192.png", sizes: "192x192", type: "image/png" }]
          },
          {
            name: "Laporan Tersimpan",
            short_name: "Tersimpan",
            description: "Lihat laporan yang tersimpan",
            url: "/laporan/tersimpan",
            icons: [{ src: "images/icons/maskable-icon-x192.png", sizes: "192x192", type: "image/png" }]
          }
        ]
      }
    })

  ]

});