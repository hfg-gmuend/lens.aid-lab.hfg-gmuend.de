/**
 * Network status monitoring utility
 */

import { writable } from 'svelte/store';

/**
 * Network status store
 */
export const networkStatus = writable({
	online: typeof navigator !== 'undefined' ? navigator.onLine : true,
	lastChecked: new Date(),
	effectiveType: null
});

/**
 * Initialize network status monitoring
 */
export function initNetworkMonitor() {
	if (typeof window === 'undefined') return () => {};

	const updateOnlineStatus = () => {
		networkStatus.update((status) => ({
			...status,
			online: navigator.onLine,
			lastChecked: new Date()
		}));
	};

	const updateConnectionInfo = () => {
		if ('connection' in navigator) {
			const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
			if (conn) {
				networkStatus.update((status) => ({
					...status,
					effectiveType: conn.effectiveType
				}));
			}
		}
	};

	// Listen for online/offline events
	window.addEventListener('online', updateOnlineStatus);
	window.addEventListener('offline', updateOnlineStatus);

	// Listen for connection changes
	if ('connection' in navigator) {
		const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
		if (conn) {
			conn.addEventListener('change', updateConnectionInfo);
		}
	}

	// Initial check
	updateOnlineStatus();
	updateConnectionInfo();

	// Cleanup function
	return () => {
		window.removeEventListener('online', updateOnlineStatus);
		window.removeEventListener('offline', updateOnlineStatus);
		if ('connection' in navigator) {
			const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
			if (conn) {
				conn.removeEventListener('change', updateConnectionInfo);
			}
		}
	};
}

/**
 * Check if network is available
 * @returns {Promise<boolean>}
 */
export async function checkNetworkAvailability() {
	if (!navigator.onLine) {
		return false;
	}

	try {
		// Try to fetch a small resource with a short timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 3000);

		await fetch('/favicon.png', {
			method: 'HEAD',
			cache: 'no-cache',
			signal: controller.signal
		});

		clearTimeout(timeoutId);
		return true;
	} catch (error) {
		return false;
	}
}
