import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

// Hardcode BASE URL
const BASE_IMAGE_URL = 'https://story-api.dicoding.dev';
const BASE_API_URL = 'https://story-api.dicoding.dev/v1';

// Precache dari vite-plugin-pwa
precacheAndRoute(self.__WB_MANIFEST);

// GAMBAR STORY dari API
registerRoute(
  ({ url }) => {
    return url.origin === BASE_IMAGE_URL && url.pathname.includes('/images/stories/');
  },
  new StaleWhileRevalidate({
    cacheName: 'story-api-images',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 60 * 24 * 60 * 60, // 60 hari
        purgeOnQuotaError: true,
      }),
    ],
  })
);

// Fallback semua gambar eksternal lain
registerRoute(
  ({ request, url }) => {
    return request.destination === 'image' && !url.origin.includes(location.origin) && url.origin !== BASE_IMAGE_URL;
  },
  new CacheFirst({
    cacheName: 'external-images-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

// API JSON
registerRoute(
  ({ url }) => {
    return url.origin === BASE_API_URL.replace('/v1', '') && url.pathname.startsWith('/v1');
  },
  new NetworkFirst({
    cacheName: 'api-cache-v2',
    networkTimeoutSeconds: 10,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 menit
      }),
    ],
  })
);

// Gambar lokal
registerRoute(
  ({ request, url }) => {
    return request.destination === 'image' && url.origin === location.origin;
  },
  new CacheFirst({
    cacheName: 'local-images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 90 * 24 * 60 * 60,
      }),
    ],
  })
);

// Script & CSS
registerRoute(
  ({ request }) => {
    return request.destination === 'script' || request.destination === 'style';
  },
  new StaleWhileRevalidate({
    cacheName: 'static-resources-v2',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

// HTML Dokumen
registerRoute(
  ({ request }) => request.destination === 'document',
  new NetworkFirst({
    cacheName: 'html-pages-v2',
    networkTimeoutSeconds: 3,
  })
);

// Optional: Cache warming manual untuk gambar
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_STORY_IMAGE') {
    const { imageUrl } = event.data;
    caches.open('story-api-images').then(cache => {
      cache.add(imageUrl).catch(err => console.log('Failed to cache image:', imageUrl, err));
    });
  }
});

// Background Sync (opsional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-stories') {
    event.waitUntil(Promise.resolve());
  }
});

// Push Notification
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Notifikasi';
  const options = data.options || {
    body: 'Ada notifikasi baru!',
    icon: '/favicon.png',
    badge: '/favicon.png',
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Error Handling Global
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;

  if (event.request.destination === 'image') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/images/placeholder.png'))
    );
  }
});
