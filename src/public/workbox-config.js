workbox: {
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/story-api\.dicoding\.dev\/v1\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
      },
    },
    {
      urlPattern: ({ request }) => request.destination === 'style' || request.destination === 'script',
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
      },
    },
    {
      urlPattern: ({ request }) => request.destination === 'document',
      handler: 'NetworkFirst',
      options: {
        cacheName: 'html-pages',
      },
    },
    {
      urlPattern: ({ request }) => request.destination === 'image',
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
        },
      },
    },
  ]
}
