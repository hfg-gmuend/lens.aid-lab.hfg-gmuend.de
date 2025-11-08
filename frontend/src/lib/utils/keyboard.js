/**
 * Keyboard shortcuts manager
 */

const shortcuts = new Map();

/**
 * Register a keyboard shortcut
 * @param {string} key - Key combination (e.g., 'Ctrl+S', 'Escape')
 * @param {Function} handler - Handler function
 * @param {Object} options - Additional options
 */
export function registerShortcut(key, handler, options = {}) {
	const { preventDefault = true } = options;

	const shortcut = {
		key: key.toLowerCase(),
		handler,
		preventDefault
	};

	shortcuts.set(key.toLowerCase(), shortcut);
}

/**
 * Unregister a keyboard shortcut
 * @param {string} key - Key combination
 */
export function unregisterShortcut(key) {
	shortcuts.delete(key.toLowerCase());
}

/**
 * Handle keyboard event
 * @param {KeyboardEvent} event - Keyboard event
 */
export function handleKeyPress(event) {
	const key = buildKeyString(event);

	const shortcut = shortcuts.get(key);
	if (shortcut) {
		if (shortcut.preventDefault) {
			event.preventDefault();
		}
		shortcut.handler(event);
	}
}

/**
 * Build key string from event
 * @param {KeyboardEvent} event - Keyboard event
 * @returns {string}
 */
function buildKeyString(event) {
	const parts = [];

	if (event.ctrlKey || event.metaKey) parts.push('ctrl');
	if (event.altKey) parts.push('alt');
	if (event.shiftKey) parts.push('shift');

	// Normalize key names
	let key = event.key.toLowerCase();
	if (key === ' ') key = 'space';

	parts.push(key);

	return parts.join('+');
}

/**
 * Initialize keyboard shortcuts listener
 */
export function initKeyboardShortcuts() {
	if (typeof window === 'undefined') return;

	window.addEventListener('keydown', handleKeyPress);

	return () => {
		window.removeEventListener('keydown', handleKeyPress);
	};
}

/**
 * Clear all shortcuts
 */
export function clearAllShortcuts() {
	shortcuts.clear();
}
