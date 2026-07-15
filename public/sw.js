// A minimal service worker to satisfy PWA requirements
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

self.addEventListener('fetch', (event) => {
  // Let the browser handle all network requests normally
  // This satisfies the PWABuilder fetch handler requirement without caching complexities
});
