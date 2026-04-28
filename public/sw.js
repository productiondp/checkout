// Simple Service Worker for PWA compliance
const CACHE_NAME = 'checkout-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass-through strategy for now to avoid caching issues during development
  event.respondWith(fetch(event.request));
});
