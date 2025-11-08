/**
 * Storage quota monitoring store
 */

import { writable } from 'svelte/store';
import { getStorageQuota } from '$lib/db/indexedDB.js';

const QUOTA_WARNING_THRESHOLD = 80; // Warn when 80% full
const QUOTA_CRITICAL_THRESHOLD = 95; // Critical when 95% full
const UPDATE_INTERVAL = 30000; // Update every 30 seconds

/**
 * Create storage monitor store
 */
function createStorageMonitor() {
	const { subscribe, set } = writable({
		usage: 0,
		quota: 0,
		percentUsed: 0,
		available: 0,
		usageInMB: '0.00',
		quotaInMB: '0.00',
		availableInMB: '0.00',
		status: 'ok', // ok, warning, critical
		lastUpdated: null
	});

	let updateTimer = null;

	async function updateQuota() {
		try {
			const quota = await getStorageQuota();
			const percentUsed = quota.percentUsed || 0;

			let status = 'ok';
			if (percentUsed >= QUOTA_CRITICAL_THRESHOLD) {
				status = 'critical';
			} else if (percentUsed >= QUOTA_WARNING_THRESHOLD) {
				status = 'warning';
			}

			set({
				...quota,
				status,
				lastUpdated: new Date()
			});
		} catch (error) {
			console.warn('Failed to update storage quota:', error);
		}
	}

	return {
		subscribe,

		/**
		 * Start monitoring storage quota
		 */
		start() {
			if (updateTimer) return;

			updateQuota();
			updateTimer = setInterval(updateQuota, UPDATE_INTERVAL);
		},

		/**
		 * Stop monitoring
		 */
		stop() {
			if (updateTimer) {
				clearInterval(updateTimer);
				updateTimer = null;
			}
		},

		/**
		 * Force update quota
		 */
		update: updateQuota
	};
}

export const storageMonitor = createStorageMonitor();
