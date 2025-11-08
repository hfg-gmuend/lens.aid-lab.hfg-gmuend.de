/**
 * Future Lens Service Worker
 * Provides offline support and caching for the PWA
 */

const CACHE_NAME = 'future-lens-v1';
const STATIC_CACHE = 'future-lens-static-v1';
const IMAGE_CACHE = 'future-lens-images-v1';
const API_CACHE = 'future-lens-api-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
	'/',
	'/about',
	'/canvas',
	'/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
	console.log('[ServiceWorker] Install');

	event.waitUntil(
		caches.open(STATIC_CACHE).then((cache) => {
			console.log('[ServiceWorker] Caching static assets');
			return cache.addAll(STATIC_ASSETS).catch((error) => {
				console.warn('[ServiceWorker] Failed to cache some assets:', error);
			});
		})
	);

	// Force the waiting service worker to become the active service worker
	self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
	console.log('[ServiceWorker] Activate');

	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (
						cacheName !== CACHE_NAME &&
						cacheName !== STATIC_CACHE &&
						cacheName !== IMAGE_CACHE &&
						cacheName !== API_CACHE
					) {
						console.log('[ServiceWorker] Removing old cache:', cacheName);
						return caches.delete(cacheName);
					}
				})
			);
		})
	);

	return self.clients.claim();
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
	const { request } = event;
	const url = new URL(request.url);

	// Skip non-GET requests
	if (request.method !== 'GET') {
		return;
	}

	// Handle API requests with network-first strategy
	if (url.origin.includes('api')) {
		event.respondWith(networkFirstStrategy(request, API_CACHE));
		return;
	}

	// Handle images with cache-first strategy
	if (request.destination === 'image' || url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
		event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
		return;
	}

	// Handle all other requests with network-first strategy
	event.respondWith(networkFirstStrategy(request, STATIC_CACHE));
});

/**
 * Network-first strategy: Try network, fall back to cache
 */
async function networkFirstStrategy(request, cacheName) {
	try {
		const networkResponse = await fetch(request);

		// Cache successful responses
		if (networkResponse.ok) {
			const cache = await caches.open(cacheName);
			cache.put(request, networkResponse.clone());
		}

		return networkResponse;
	} catch (error) {
		// Network failed, try cache
		const cachedResponse = await caches.match(request);

		if (cachedResponse) {
			console.log('[ServiceWorker] Serving from cache:', request.url);
			return cachedResponse;
		}

		// Return offline page or error response
		return new Response('Offline - Content not available', {
			status: 503,
			statusText: 'Service Unavailable',
			headers: new Headers({
				'Content-Type': 'text/plain'
			})
		});
	}
}

/**
 * Cache-first strategy: Try cache, fall back to network
 */
async function cacheFirstStrategy(request, cacheName) {
	const cachedResponse = await caches.match(request);

	if (cachedResponse) {
		return cachedResponse;
	}

	try {
		const networkResponse = await fetch(request);

		if (networkResponse.ok) {
			const cache = await caches.open(cacheName);
			cache.put(request, networkResponse.clone());
		}

		return networkResponse;
	} catch (error) {
		console.warn('[ServiceWorker] Fetch failed for:', request.url);
		return new Response('Image not available offline', {
			status: 503,
			statusText: 'Service Unavailable'
		});
	}
}

// Handle messages from clients
self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}

	if (event.data && event.data.type === 'CLEAR_CACHE') {
		event.waitUntil(
			caches.keys().then((cacheNames) => {
				return Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
			})
		);
	}
});

// Background sync for failed requests (if supported)
if (self.registration.sync) {
	self.addEventListener('sync', (event) => {
		if (event.tag === 'sync-transformations') {
			event.waitUntil(syncTransformations());
		}
	});
}

async function syncTransformations() {
	console.log('[ServiceWorker] Background sync triggered');
	// This would sync any pending transformations stored in IndexedDB
	// Implementation depends on app-specific logic
}
