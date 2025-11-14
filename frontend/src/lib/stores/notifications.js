import { writable } from 'svelte/store';

export const notifications = writable([]);

let idCounter = 0;

/**
 * Add a notification
 * @param {string} message - The message to display
 * @param {string} type - The type of notification: 'success', 'error', 'warning', 'info'
 * @param {number} duration - How long to show the notification in ms (0 = permanent)
 */
export function addNotification(message, type = 'info', duration = 1000) {
	// Only show toasts for errors and warnings
	if (type !== 'error' && type !== 'warning') {
		return null;
	}

	const id = idCounter++;
	const notification = { id, message, type, duration };

	notifications.update((n) => [...n, notification]);

	if (duration > 0) {
		setTimeout(() => {
			removeNotification(id);
		}, duration);
	}

	return id;
}

/**
 * Remove a notification by ID
 * @param {number} id - The notification ID to remove
 */
export function removeNotification(id) {
	notifications.update((n) => n.filter((notification) => notification.id !== id));
}

/**
 * Clear all notifications
 */
export function clearAllNotifications() {
	notifications.set([]);
}

/**
 * Convenience methods
 */
export function notifySuccess(message, duration = 1000) {
	return addNotification(message, 'success', duration);
}

export function notifyError(message, duration = 4000) {
	return addNotification(message, 'error', duration);
}

export function notifyWarning(message, duration = 3500) {
	return addNotification(message, 'warning', duration);
}

export function notifyInfo(message, duration = 1000) {
	return addNotification(message, 'info', duration);
}
