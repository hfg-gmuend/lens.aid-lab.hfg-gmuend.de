/**
 * Export/Import utilities for history data
 */

/**
 * Export history data to JSON file
 * @param {Array} history - History data to export
 * @param {string} filename - Optional filename
 */
export function exportHistoryAsJSON(history, filename = 'futures-lens-history.json') {
	const data = {
		version: '1.0',
		exportDate: new Date().toISOString(),
		totalGroups: history.length,
		totalVariations: history.reduce((sum, group) => sum + group.variations.length, 0),
		history
	};

	const jsonStr = JSON.stringify(data, null, 2);
	const blob = new Blob([jsonStr], { type: 'application/json' });
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.click();

	URL.revokeObjectURL(url);
}

/**
 * Import history data from JSON file
 * @returns {Promise<Array>}
 */
export async function importHistoryFromJSON() {
	return new Promise((resolve, reject) => {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'application/json,.json';

		input.onchange = async (e) => {
			const file = e.target.files?.[0];
			if (!file) {
				reject(new Error('No file selected'));
				return;
			}

			try {
				const text = await file.text();
				const data = JSON.parse(text);

				// Validate data structure
				if (!data.history || !Array.isArray(data.history)) {
					throw new Error('Invalid history file format');
				}

				resolve(data.history);
			} catch (error) {
				reject(error);
			}
		};

		input.click();
	});
}

/**
 * Export all history images as data URLs
 * @param {Array} history - History data
 * @returns {Promise<Object>} Object with image URLs
 */
export async function exportHistoryWithImages(history) {
	const images = {};

	for (const group of history) {
		// Store input image
		images[group.inputImage] = await fetchImageAsDataURL(group.inputImage);

		// Store variation images
		for (const variation of group.variations) {
			images[variation.resultImage] = await fetchImageAsDataURL(variation.resultImage);
		}
	}

	return {
		version: '1.0',
		exportDate: new Date().toISOString(),
		history,
		images
	};
}

/**
 * Fetch image as data URL
 * @param {string} url - Image URL
 * @returns {Promise<string>} Data URL
 */
async function fetchImageAsDataURL(url) {
	try {
		const response = await fetch(url);
		const blob = await response.blob();
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	} catch (error) {
		console.error('Failed to fetch image:', url, error);
		return null;
	}
}

/**
 * Calculate total storage size of history
 * @param {Array} history - History data
 * @returns {number} Size in bytes
 */
export function calculateHistorySize(history) {
	const jsonStr = JSON.stringify(history);
	return new Blob([jsonStr]).size;
}

/**
 * Format bytes to human readable
 * @param {number} bytes - Bytes
 * @returns {string} Formatted string
 */
export function formatBytes(bytes) {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
