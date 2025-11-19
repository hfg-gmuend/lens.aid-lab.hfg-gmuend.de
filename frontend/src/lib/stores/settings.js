/**
 * User settings store with localStorage persistence
 */

import { writable, get } from 'svelte/store';

const SETTINGS_KEY = 'futures-lens-settings';

const defaultSettings = {
	denoise: 0.85,
	historyViewMode: 'grid',
	historyGroupMode: 'grouped',
	cameraFacingMode: 'environment',
	autoSaveHistory: true,
	maxHistoryItems: 20,
	imageQuality: 0.8,
	compressionEnabled: true
	,seedLock: false,
	lockedSeed: -1
};

/**
 * Load settings from localStorage
 * @returns {Object}
 */
function loadSettings() {
	if (typeof localStorage === 'undefined') {
		return { ...defaultSettings };
	}

	try {
		const stored = localStorage.getItem(SETTINGS_KEY);
		if (stored) {
			const parsed = JSON.parse(stored);
			// Merge with defaults to handle new settings
			return { ...defaultSettings, ...parsed };
		}
	} catch (error) {
		console.warn('Failed to load settings:', error);
	}

	return { ...defaultSettings };
}

/**
 * Save settings to localStorage
 * @param {Object} settings - Settings to save
 */
function saveSettings(settings) {
	if (typeof localStorage === 'undefined') return;

	try {
		localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
	} catch (error) {
		console.warn('Failed to save settings:', error);
	}
}

/**
 * Create settings store
 */
function createSettingsStore() {
	const { subscribe, set, update } = writable(loadSettings());

	return {
		subscribe,
		set: (value) => {
			set(value);
			saveSettings(value);
		},
		update: (fn) => {
			update((current) => {
				const updated = fn(current);
				saveSettings(updated);
				return updated;
			});
		},
		updateSetting: (key, value) => {
			update((current) => {
				const updated = { ...current, [key]: value };
				saveSettings(updated);
				return updated;
			});
		},
		reset: () => {
			set(defaultSettings);
			saveSettings(defaultSettings);
		},
		resetSetting: (key) => {
			update((current) => {
				const updated = { ...current, [key]: defaultSettings[key] };
				saveSettings(updated);
				return updated;
			});
		}
	};
}

export const settings = createSettingsStore();

// Convenience getters for specific settings
export function getDenoise() {
	return get(settings).denoise;
}

export function getHistoryViewMode() {
	return get(settings).historyViewMode;
}

export function getHistoryGroupMode() {
	return get(settings).historyGroupMode;
}

export function getMaxHistoryItems() {
	return get(settings).maxHistoryItems;
}

export function getImageQuality() {
	return get(settings).imageQuality;
}

export function isCompressionEnabled() {
	return get(settings).compressionEnabled;
}
