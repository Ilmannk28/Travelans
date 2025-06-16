const CACHE_NAME = 'travelans-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/scripts/index.js',
  '/styles/styles.css',
  '/favicon.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});

// Handler untuk push notification (tetap ada)
self.addEventListener('push', (event) => {
  const data = event.data?.json();
  const { title, options } = data;
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
