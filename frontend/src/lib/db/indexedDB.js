/**
 * IndexedDB wrapper for Future Lens storage
 * Provides a simple interface for storing and retrieving data
 */

const DB_NAME = 'futures-lens-db';
const DB_VERSION = 1;

// Store names
export const STORES = {
	HISTORY: 'history',
	SETTINGS: 'settings',
	PROMPTS: 'prompts',
	CACHE: 'cache'
};

let dbInstance = null;

/**
 * Initialize and open the database
 * @returns {Promise<IDBDatabase>}
 */
export async function openDB() {
	if (dbInstance) return dbInstance;

	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = () => {
			console.error('Failed to open database:', request.error);
			reject(request.error);
		};

		request.onsuccess = () => {
			dbInstance = request.result;
			resolve(dbInstance);
		};

		request.onupgradeneeded = (event) => {
			const db = event.target.result;

			// Create history store
			if (!db.objectStoreNames.contains(STORES.HISTORY)) {
				const historyStore = db.createObjectStore(STORES.HISTORY, {
					keyPath: 'id',
					autoIncrement: true
				});
				historyStore.createIndex('inputHash', 'inputHash', { unique: false });
				historyStore.createIndex('timestamp', 'timestamp', { unique: false });
			}

			// Create settings store
			if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
				db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
			}

			// Create prompts store
			if (!db.objectStoreNames.contains(STORES.PROMPTS)) {
				const promptsStore = db.createObjectStore(STORES.PROMPTS, {
					keyPath: 'id',
					autoIncrement: true
				});
				promptsStore.createIndex('text', 'text', { unique: false });
				promptsStore.createIndex('timestamp', 'timestamp', { unique: false });
			}

			// Create cache store
			if (!db.objectStoreNames.contains(STORES.CACHE)) {
				const cacheStore = db.createObjectStore(STORES.CACHE, { keyPath: 'url' });
				cacheStore.createIndex('timestamp', 'timestamp', { unique: false });
			}
		};
	});
}

/**
 * Get all records from a store
 * @param {string} storeName - Name of the store
 * @returns {Promise<Array>}
 */
export async function getAll(storeName) {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(storeName, 'readonly');
		const store = transaction.objectStore(storeName);
		const request = store.getAll();

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

/**
 * Get a single record by key
 * @param {string} storeName - Name of the store
 * @param {any} key - Record key
 * @returns {Promise<any>}
 */
export async function get(storeName, key) {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(storeName, 'readonly');
		const store = transaction.objectStore(storeName);
		const request = store.get(key);

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

/**
 * Add or update a record
 * @param {string} storeName - Name of the store
 * @param {any} data - Data to store
 * @returns {Promise<any>}
 */
export async function put(storeName, data) {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(storeName, 'readwrite');
		const store = transaction.objectStore(storeName);
		const request = store.put(data);

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

/**
 * Add a new record
 * @param {string} storeName - Name of the store
 * @param {any} data - Data to store
 * @returns {Promise<any>}
 */
export async function add(storeName, data) {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(storeName, 'readwrite');
		const store = transaction.objectStore(storeName);
		const request = store.add(data);

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

/**
 * Delete a record
 * @param {string} storeName - Name of the store
 * @param {any} key - Record key
 * @returns {Promise<void>}
 */
export async function remove(storeName, key) {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(storeName, 'readwrite');
		const store = transaction.objectStore(storeName);
		const request = store.delete(key);

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

/**
 * Clear all records from a store
 * @param {string} storeName - Name of the store
 * @returns {Promise<void>}
 */
export async function clear(storeName) {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(storeName, 'readwrite');
		const store = transaction.objectStore(storeName);
		const request = store.clear();

		request.onsuccess = () => resolve();
		request.onerror = () => reject(request.error);
	});
}

/**
 * Count records in a store
 * @param {string} storeName - Name of the store
 * @returns {Promise<number>}
 */
export async function count(storeName) {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(storeName, 'readonly');
		const store = transaction.objectStore(storeName);
		const request = store.count();

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

/**
 * Get records by index
 * @param {string} storeName - Name of the store
 * @param {string} indexName - Name of the index
 * @param {any} value - Value to search for
 * @returns {Promise<Array>}
 */
export async function getByIndex(storeName, indexName, value) {
	const db = await openDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(storeName, 'readonly');
		const store = transaction.objectStore(storeName);
		const index = store.index(indexName);
		const request = index.getAll(value);

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

/**
 * Get storage quota information
 * @returns {Promise<Object>}
 */
export async function getStorageQuota() {
	if (!navigator.storage || !navigator.storage.estimate) {
		return {
			usage: 0,
			quota: 0,
			percentUsed: 0,
			available: 0
		};
	}

	try {
		const estimate = await navigator.storage.estimate();
		const usage = estimate.usage || 0;
		const quota = estimate.quota || 0;
		const percentUsed = quota > 0 ? (usage / quota) * 100 : 0;
		const available = quota - usage;

		return {
			usage,
			quota,
			percentUsed,
			available,
			usageInMB: (usage / 1024 / 1024).toFixed(2),
			quotaInMB: (quota / 1024 / 1024).toFixed(2),
			availableInMB: (available / 1024 / 1024).toFixed(2)
		};
	} catch (error) {
		console.warn('Failed to get storage quota:', error);
		return {
			usage: 0,
			quota: 0,
			percentUsed: 0,
			available: 0
		};
	}
}

/**
 * Migrate data from localStorage to IndexedDB
 * @param {string} localStorageKey - localStorage key
 * @param {string} storeName - IndexedDB store name
 * @param {Function} transform - Optional transform function
 * @returns {Promise<void>}
 */
export async function migrateFromLocalStorage(localStorageKey, storeName, transform = (data) => data) {
	if (typeof localStorage === 'undefined') return;

	try {
		const data = localStorage.getItem(localStorageKey);
		if (!data) return;

		const parsed = JSON.parse(data);
		const transformed = transform(parsed);

		// If it's an array, add each item
		if (Array.isArray(transformed)) {
			for (const item of transformed) {
				await add(storeName, item);
			}
		} else {
			await put(storeName, transformed);
		}

		// Remove from localStorage after successful migration
		localStorage.removeItem(localStorageKey);
		console.log(`Migrated ${localStorageKey} to IndexedDB`);
	} catch (error) {
		console.warn(`Failed to migrate ${localStorageKey}:`, error);
	}
}

/**
 * Export database to JSON
 * @returns {Promise<Object>}
 */
export async function exportDatabase() {
	const db = await openDB();
	const data = {};

	for (const storeName of db.objectStoreNames) {
		data[storeName] = await getAll(storeName);
	}

	return {
		version: DB_VERSION,
		exportDate: new Date().toISOString(),
		data
	};
}

/**
 * Import database from JSON
 * @param {Object} backup - Backup data
 * @returns {Promise<void>}
 */
export async function importDatabase(backup) {
	if (!backup || !backup.data) {
		throw new Error('Invalid backup data');
	}

	for (const [storeName, records] of Object.entries(backup.data)) {
		if (!Object.values(STORES).includes(storeName)) continue;

		await clear(storeName);

		for (const record of records) {
			await put(storeName, record);
		}
	}

	console.log('Database imported successfully');
}
