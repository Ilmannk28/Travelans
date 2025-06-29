import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';

// Inject semua file dari globPatterns di vite.config.js
precacheAndRoute(self.__WB_MANIFEST);

// API
registerRoute(
  ({ url }) => url.origin === 'https://story-api.dicoding.dev' && url.pathname.startsWith('/v1'),
  new NetworkFirst({
    cacheName: 'api-cache',
  })
);

// Static resources
registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

// HTML
registerRoute(
  ({ request }) => request.destination === 'document',
  new NetworkFirst({
    cacheName: 'html-pages',
  })
);

// Images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    expiration: {
      maxEntries: 50,
      maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
    },
  })
);

// Push notification handler
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const title = data.title || 'Notifikasi';
  const options = data.options || {
    body: 'Ada notifikasi baru!',
    icon: '/favicon.png',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
