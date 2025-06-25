const CACHE_NAME = 'travelans-v1';
const API_URL = "https://story-api.dicoding.dev/v1/";
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

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.url.startsWith(API_URL)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone response dan simpan ke cache
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  } else {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return cachedResponse || fetch(request);
      })
    );
  }
});

// Handler untuk push notification (tetap ada)
self.addEventListener('push', (event) => {
  const data = event.data?.json();
  const { title, options } = data;
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
