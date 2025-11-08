import { writable, derived } from 'svelte/store';

const FAVORITES_KEY = 'futures-lens-favorite-prompts';
const HISTORY_KEY = 'futures-lens-prompt-history';
const MAX_HISTORY = 50;

/**
 * Store for favorite prompts
 */
function createFavoritesStore() {
	const { subscribe, set, update } = writable([]);

	// Load from localStorage on init
	if (typeof window !== 'undefined') {
		try {
			const stored = localStorage.getItem(FAVORITES_KEY);
			if (stored) {
				set(JSON.parse(stored));
			}
		} catch (error) {
			console.error('Failed to load favorites:', error);
		}
	}

	return {
		subscribe,
		add: (prompt) => {
			update((favorites) => {
				if (!favorites.includes(prompt)) {
					const newFavorites = [...favorites, prompt];
					try {
						localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
					} catch (error) {
						console.error('Failed to save favorites:', error);
					}
					return newFavorites;
				}
				return favorites;
			});
		},
		remove: (prompt) => {
			update((favorites) => {
				const newFavorites = favorites.filter((f) => f !== prompt);
				try {
					localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
				} catch (error) {
					console.error('Failed to save favorites:', error);
				}
				return newFavorites;
			});
		},
		toggle: (prompt) => {
			update((favorites) => {
				let newFavorites;
				if (favorites.includes(prompt)) {
					newFavorites = favorites.filter((f) => f !== prompt);
				} else {
					newFavorites = [...favorites, prompt];
				}
				try {
					localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
				} catch (error) {
					console.error('Failed to save favorites:', error);
				}
				return newFavorites;
			});
		},
		clear: () => {
			set([]);
			try {
				localStorage.removeItem(FAVORITES_KEY);
			} catch (error) {
				console.error('Failed to clear favorites:', error);
			}
		}
	};
}

/**
 * Store for prompt history
 */
function createPromptHistoryStore() {
	const { subscribe, set, update } = writable([]);

	// Load from localStorage on init
	if (typeof window !== 'undefined') {
		try {
			const stored = localStorage.getItem(HISTORY_KEY);
			if (stored) {
				set(JSON.parse(stored));
			}
		} catch (error) {
			console.error('Failed to load prompt history:', error);
		}
	}

	return {
		subscribe,
		add: (prompt) => {
			update((history) => {
				// Remove duplicate if exists
				const filtered = history.filter((h) => h.text !== prompt);
				// Add to beginning
				const newHistory = [
					{
						text: prompt,
						timestamp: new Date().toISOString(),
						usageCount: 1
					},
					...filtered
				].slice(0, MAX_HISTORY);

				try {
					localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
				} catch (error) {
					console.error('Failed to save prompt history:', error);
				}
				return newHistory;
			});
		},
		increment: (prompt) => {
			update((history) => {
				const newHistory = history.map((h) =>
					h.text === prompt ? { ...h, usageCount: h.usageCount + 1 } : h
				);

				try {
					localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
				} catch (error) {
					console.error('Failed to save prompt history:', error);
				}
				return newHistory;
			});
		},
		clear: () => {
			set([]);
			try {
				localStorage.removeItem(HISTORY_KEY);
			} catch (error) {
				console.error('Failed to clear prompt history:', error);
			}
		}
	};
}

export const favoritePrompts = createFavoritesStore();
export const promptHistory = createPromptHistoryStore();

/**
 * Derived store for prompt suggestions
 */
export const promptSuggestions = derived(
	[favoritePrompts, promptHistory],
	([$favorites, $history]) => {
		// Combine favorites and recent history
		const suggestions = new Set([...$favorites, ...$history.map((h) => h.text)]);
		return Array.from(suggestions);
	}
);
