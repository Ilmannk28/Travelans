import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Inject semua file dari globPatterns di vite.config.js
precacheAndRoute(self.__WB_MANIFEST);


registerRoute(
  ({ url }) => url.origin === 'https://story-api.dicoding.dev' && url.pathname.startsWith('/v1'),
  new NetworkFirst({
    cacheName: 'api-cache',
  })
);


registerRoute(
  ({ request }) => request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

registerRoute(
  ({ request }) => request.destination === 'document',
  new NetworkFirst({
    cacheName: 'html-pages',
  })
);


registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);


registerRoute(
  ({ url }) =>
    url.origin === 'https://story-api.dicoding.dev' &&
    url.pathname.startsWith('/images/'),
  new CacheFirst({
    cacheName: 'external-images',
    fetchOptions: {
      mode: 'no-cors', // untuk handle opaque response dari CDN atau server tanpa CORS
    },
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);


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
