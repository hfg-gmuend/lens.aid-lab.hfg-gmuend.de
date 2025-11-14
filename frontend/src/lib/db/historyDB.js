/**
 * History database operations using IndexedDB
 */

import { writable, get } from 'svelte/store';
import * as db from './indexedDB.js';

const MIGRATION_KEY = 'futures-lens-history';
const MAX_HISTORY = 100; // Increased from 20 since IndexedDB can handle more

/**
 * Transform old localStorage format to IndexedDB format
 * @param {Array} oldHistory - Old history array
 * @returns {Array}
 */
function transformHistoryForMigration(oldHistory) {
	if (!Array.isArray(oldHistory)) return [];

	const items = [];
	for (const group of oldHistory) {
		for (const variation of group.variations || []) {
			items.push({
				inputHash: group.inputHash,
				inputImage: variation.inputImage || group.inputImage,
				resultImage: variation.resultImage,
				prompt: variation.prompt,
				denoise: variation.denoise,
				seed: variation.seed,
				timestamp: variation.timestamp || Date.now()
			});
		}
	}
	return items;
}

/**
 * Create history store with IndexedDB
 */
function createHistoryStore() {
	const { subscribe, set, update } = writable([]);
	let isInitialized = false;

	return {
		subscribe,

		/**
		 * Initialize store and load history from IndexedDB
		 */
		async init() {
			if (isInitialized) return;

			try {
				// Try to migrate from localStorage first
				if (typeof localStorage !== 'undefined') {
					const oldData = localStorage.getItem(MIGRATION_KEY);
					if (oldData) {
						try {
							const parsed = JSON.parse(oldData);
							const transformed = transformHistoryForMigration(parsed);

							for (const item of transformed) {
								await db.add(db.STORES.HISTORY, item);
							}

							localStorage.removeItem(MIGRATION_KEY);
							console.log('Migrated history to IndexedDB');
						} catch (error) {
							console.warn('Failed to migrate history:', error);
						}
					}
				}

				// Load all history items
				const items = await db.getAll(db.STORES.HISTORY);

				// Sort by timestamp descending
				items.sort((a, b) => b.timestamp - a.timestamp);

				// Group by inputHash
				const grouped = groupHistoryByInput(items);

				set(grouped);
				isInitialized = true;
			} catch (error) {
				console.error('Failed to initialize history store:', error);
				set([]);
			}
		},

		/**
		 * Add a new history item
		 */
		async add(inputHash, inputImage, resultImage, prompt, denoise, seed) {
			try {
				const item = {
					inputHash,
					inputImage,
					resultImage,
					prompt,
					denoise,
					seed,
					timestamp: Date.now()
				};

				const id = await db.add(db.STORES.HISTORY, item);
				item.id = id;

				// Update store
				update((history) => {
					// Find existing group or create new one
					const groupIndex = history.findIndex((g) => g.inputHash === inputHash);

					if (groupIndex >= 0) {
						// Add to existing group and move group to top
						const existingGroup = history[groupIndex];
						
						// Create new group object with new variations array to trigger reactivity
						const updatedGroup = {
							...existingGroup,
							variations: [
								{
									id,
									inputImage,
									resultImage,
									prompt,
									denoise,
									seed,
									timestamp: item.timestamp
								},
								...existingGroup.variations
							]
						};
						
						// Remove old group and add updated group at the top
						const newHistory = history.filter((_, i) => i !== groupIndex);
						return [updatedGroup, ...newHistory];
					} else {
						// Create new group at the top
						return [
							{
								inputHash,
								inputImage,
								variations: [
									{
										id,
										inputImage,
										resultImage,
										prompt,
										denoise,
										seed,
										timestamp: item.timestamp
									}
								]
							},
							...history
						];
					}
				});

				// Cleanup old items if over limit
				await this.cleanup();
			} catch (error) {
				console.error('Failed to add history item:', error);
			}
		},

		/**
		 * Remove a single variation
		 */
		async removeVariation(id) {
			try {
				await db.remove(db.STORES.HISTORY, id);

				update((history) => {
					const newHistory = history.map((group) => {
						const variationIndex = group.variations.findIndex((v) => v.id === id);
						if (variationIndex >= 0) {
							// Create new group with variation removed
							return {
								...group,
								variations: group.variations.filter((v) => v.id !== id)
							};
						}
						return group;
					});
					// Filter out empty groups
					return newHistory.filter((g) => g.variations.length > 0);
				});
			} catch (error) {
				console.error('Failed to remove variation:', error);
			}
		},

		/**
		 * Remove entire group
		 */
		async removeGroup(inputHash) {
			try {
				const items = await db.getByIndex(db.STORES.HISTORY, 'inputHash', inputHash);

				for (const item of items) {
					await db.remove(db.STORES.HISTORY, item.id);
				}

				update((history) => history.filter((g) => g.inputHash !== inputHash));
			} catch (error) {
				console.error('Failed to remove group:', error);
			}
		},

		/**
		 * Clear all history
		 */
		async clear() {
			try {
				await db.clear(db.STORES.HISTORY);
				set([]);
			} catch (error) {
				console.error('Failed to clear history:', error);
			}
		},

		/**
		 * Cleanup old items if over limit
		 */
		async cleanup() {
			try {
				const count = await db.count(db.STORES.HISTORY);

				if (count > MAX_HISTORY) {
					const items = await db.getAll(db.STORES.HISTORY);
					items.sort((a, b) => a.timestamp - b.timestamp); // Oldest first

					const toRemove = count - MAX_HISTORY;
					for (let i = 0; i < toRemove; i++) {
						await db.remove(db.STORES.HISTORY, items[i].id);
					}

					console.log(`Cleaned up ${toRemove} old history items`);
				}
			} catch (error) {
				console.error('Failed to cleanup history:', error);
			}
		},

		/**
		 * Export history as JSON
		 */
		async export() {
			try {
				const items = await db.getAll(db.STORES.HISTORY);
				const grouped = groupHistoryByInput(items);

				return {
					version: '2.0',
					format: 'indexeddb',
					exportDate: new Date().toISOString(),
					totalGroups: grouped.length,
					totalVariations: items.length,
					history: grouped
				};
			} catch (error) {
				console.error('Failed to export history:', error);
				return null;
			}
		},

		/**
		 * Get storage statistics
		 */
		async getStats() {
			try {
				const count = await db.count(db.STORES.HISTORY);
				const quota = await db.getStorageQuota();

				return {
					itemCount: count,
					maxItems: MAX_HISTORY,
					...quota
				};
			} catch (error) {
				console.error('Failed to get history stats:', error);
				return null;
			}
		}
	};
}

/**
 * Group history items by inputHash
 * @param {Array} items - History items
 * @returns {Array}
 */
function groupHistoryByInput(items) {
	const groups = new Map();

	for (const item of items) {
		if (!groups.has(item.inputHash)) {
			groups.set(item.inputHash, {
				inputHash: item.inputHash,
				inputImage: item.inputImage,
				variations: []
			});
		}

		groups.get(item.inputHash).variations.push({
			id: item.id,
			inputImage: item.inputImage,
			resultImage: item.resultImage,
			prompt: item.prompt,
			denoise: item.denoise,
			seed: item.seed,
			timestamp: item.timestamp
		});
	}

	// Convert to array and sort by most recent variation in each group
	const grouped = Array.from(groups.values());
	grouped.forEach((group) => {
		group.variations.sort((a, b) => b.timestamp - a.timestamp);
	});

	grouped.sort((a, b) => {
		const aLatest = a.variations[0]?.timestamp || 0;
		const bLatest = b.variations[0]?.timestamp || 0;
		return bLatest - aLatest;
	});

	return grouped;
}

export const historyDB = createHistoryStore();
