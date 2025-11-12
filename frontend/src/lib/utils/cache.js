/**
 * Image caching utility using localStorage and in-memory cache
 */

const CACHE_VERSION = '1.0';
const CACHE_PREFIX = 'fl-cache-';
const MAX_CACHE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// In-memory cache for quick access
const memoryCache = new Map();

/**
 * Generate cache key
 * @param {string} url - URL to cache
 * @returns {string}
 */
function getCacheKey(url) {
	return `${CACHE_PREFIX}${btoa(url).slice(0, 50)}`;
}

/**
 * Get cached item metadata
 * @param {string} key - Cache key
 * @returns {Object|null}
 */
function getCacheMetadata(key) {
	try {
		const metaKey = `${key}-meta`;
		const metaStr = localStorage.getItem(metaKey);
		if (!metaStr) return null;
		return JSON.parse(metaStr);
	} catch (error) {
		return null;
	}
}

/**
 * Set cache metadata
 * @param {string} key - Cache key
 * @param {Object} metadata - Metadata to store
 */
function setCacheMetadata(key, metadata) {
	try {
		const metaKey = `${key}-meta`;
		localStorage.setItem(metaKey, JSON.stringify(metadata));
	} catch (error) {
		console.warn('Failed to set cache metadata:', error);
	}
}

/**
 * Check if cache entry is valid
 * @param {Object} metadata - Cache metadata
 * @returns {boolean}
 */
function isCacheValid(metadata) {
	if (!metadata) return false;
	if (metadata.version !== CACHE_VERSION) return false;

	const age = Date.now() - metadata.timestamp;
	if (age > MAX_CACHE_AGE) return false;

	return true;
}

/**
 * Get total cache size
 * @returns {number}
 */
function getCacheSize() {
	let totalSize = 0;
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key && key.startsWith(CACHE_PREFIX)) {
			const value = localStorage.getItem(key);
			totalSize += key.length + (value ? value.length : 0);
		}
	}
	return totalSize;
}

/**
 * Clear oldest cache entries to make space
 */
function makeSpace() {
	const entries = [];

	// Collect all cache entries with metadata
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key && key.startsWith(CACHE_PREFIX) && !key.endsWith('-meta')) {
			const metadata = getCacheMetadata(key);
			if (metadata) {
				entries.push({ key, metadata });
			}
		}
	}

	// Sort by timestamp (oldest first)
	entries.sort((a, b) => a.metadata.timestamp - b.metadata.timestamp);

	// Remove oldest entries until we're under the limit
	let currentSize = getCacheSize();
	let i = 0;
	while (currentSize > MAX_CACHE_SIZE * 0.7 && i < entries.length) {
		const { key } = entries[i];
		localStorage.removeItem(key);
		localStorage.removeItem(`${key}-meta`);
		memoryCache.delete(key);
		currentSize = getCacheSize();
		i++;
	}
}

/**
 * Cache an image
 * @param {string} url - Image URL
 * @param {string} dataUrl - Image data URL
 * @returns {Promise<void>}
 */
export async function cacheImage(url, dataUrl) {
	if (!url || !dataUrl) return;

	const key = getCacheKey(url);

	// Store in memory cache
	memoryCache.set(key, dataUrl);

	// Try to store in localStorage
	try {
		// Check size before storing
		const sizeEstimate = dataUrl.length;
		const currentSize = getCacheSize();

		if (currentSize + sizeEstimate > MAX_CACHE_SIZE) {
			makeSpace();
		}

		localStorage.setItem(key, dataUrl);
		setCacheMetadata(key, {
			version: CACHE_VERSION,
			timestamp: Date.now(),
			url,
			size: sizeEstimate
		});
	} catch (error) {
		// If storage fails (quota exceeded), make space and try again
		console.warn('Cache storage failed, clearing space:', error);
		makeSpace();

		try {
			localStorage.setItem(key, dataUrl);
			setCacheMetadata(key, {
				version: CACHE_VERSION,
				timestamp: Date.now(),
				url,
				size: dataUrl.length
			});
		} catch (retryError) {
			console.warn('Failed to cache image after retry:', retryError);
		}
	}
}

/**
 * Get cached image
 * @param {string} url - Image URL
 * @returns {string|null}
 */
export function getCachedImage(url) {
	if (!url) return null;

	const key = getCacheKey(url);

	// Check memory cache first
	if (memoryCache.has(key)) {
		return memoryCache.get(key);
	}

	// Check localStorage
	try {
		const metadata = getCacheMetadata(key);
		if (!isCacheValid(metadata)) {
			// Remove invalid cache entry
			localStorage.removeItem(key);
			localStorage.removeItem(`${key}-meta`);
			return null;
		}

		const dataUrl = localStorage.getItem(key);
		if (dataUrl) {
			// Store in memory cache for quick access
			memoryCache.set(key, dataUrl);
			return dataUrl;
		}
	} catch (error) {
		console.warn('Failed to get cached image:', error);
	}

	return null;
}

/**
 * Clear all cached images
 */
export function clearCache() {
	// Clear memory cache
	memoryCache.clear();

	// Clear localStorage cache
	const keysToRemove = [];
	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key && key.startsWith(CACHE_PREFIX)) {
			keysToRemove.push(key);
		}
	}

	keysToRemove.forEach((key) => {
		localStorage.removeItem(key);
	});
}

/**
 * Get cache statistics
 * @returns {Object}
 */
export function getCacheStats() {
	const entries = [];

	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key && key.startsWith(CACHE_PREFIX) && !key.endsWith('-meta')) {
			const metadata = getCacheMetadata(key);
			if (metadata) {
				entries.push(metadata);
			}
		}
	}

	return {
		totalSize: getCacheSize(),
		entryCount: entries.length,
		memoryEntries: memoryCache.size,
		maxSize: MAX_CACHE_SIZE,
		maxAge: MAX_CACHE_AGE
	};
}

/**
 * Preload and cache image
 * @param {string} url - Image URL
 * @returns {Promise<void>}
 */
export async function preloadImage(url) {
	if (!url) return;

	// Check if already cached
	const cached = getCachedImage(url);
	if (cached) return;

	try {
		const response = await fetch(url);
		const blob = await response.blob();

		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				cacheImage(url, reader.result);
				resolve();
			};
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	} catch (error) {
		console.warn('Failed to preload image:', error);
	}
}
