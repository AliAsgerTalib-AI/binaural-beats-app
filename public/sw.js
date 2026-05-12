/**
 * Service Worker for Brainwave PWA
 *
 * Caching Strategy: Network-First
 * 1. Try to fetch from network (user always gets latest)
 * 2. On network failure, fall back to cached version
 * 3. Cache successful responses for future offline use
 * 4. For navigation requests, show offline.html if no cache
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `binaural-beats-${CACHE_VERSION}`;

// Critical files to cache on service worker install
const CACHE_ASSETS = [
  '/',
  '/offline.html',
  '/favicon.ico',
];

/**
 * Install event: Cache critical assets when service worker is registered
 * skipWaiting() ensures new SW takes over immediately
 */
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(CACHE_ASSETS).catch((err) => {
        console.warn('[Service Worker] Cache.addAll error:', err);
      });
    })
  );
  self.skipWaiting();
});

/**
 * Activate event: Clean up old cache versions
 * Runs when new service worker becomes active
 * Prevents stale cache accumulation across versions
 */
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('binaural-beats-') && name !== CACHE_NAME)
          .map((name) => {
            console.log('[Service Worker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    })
  );
  self.clients.claim();
});

/**
 * Fetch event: Network-first strategy for all requests
 * 1. GET requests only (non-GET go to network)
 * 2. Same-origin only (external requests go to network)
 * 3. Try network first, cache successful responses
 * 4. On failure, serve from cache or offline.html
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests (POST, PUT, DELETE, etc.)
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (external APIs, CDNs, etc.)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Network-first strategy
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses (status 200-299)
        if (response.ok) {
          const cache = caches.open(CACHE_NAME);
          cache.then((c) => c.put(request, response.clone()));
        }
        return response;
      })
      .catch(() => {
        // Network failed: fall back to cache
        return caches.match(request).then((cached) => {
          if (cached) {
            return cached;
          }
          // No cache available: show offline page for navigation, error for resources
          if (request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          return new Response('Offline - resource not available', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });
      })
  );
});

// Handle push notifications
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || 'Time for your Brainwave Entrainment session',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: 'brainwave-notification',
    requireInteraction: false,
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Brainwave', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // If window is open, focus it
      for (let i = 0; i < clientList.length; i++) {
        if (clientList[i].url === event.notification.data.url && 'focus' in clientList[i]) {
          return clientList[i].focus();
        }
      }
      // Otherwise, open new window
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});

// Periodic background sync (optional: for future session reminders)
self.addEventListener('sync', (event) => {
  if (event.tag === 'session-reminder') {
    event.waitUntil(
      // Logic for sending reminders would go here
      Promise.resolve()
    );
  }
});

console.log('[Service Worker] Loaded');
