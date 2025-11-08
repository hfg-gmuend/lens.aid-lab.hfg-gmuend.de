<script>
	import { notifications, removeNotification } from '$lib/stores/notifications.js';
	import { fly, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import Icon from './Icon.svelte';
	import checkIcon from '$lib/assets/icons/check.svg?raw';
	import closeIcon from '$lib/assets/icons/close.svg?raw';

	function getIcon(type) {
		switch (type) {
			case 'success':
				return checkIcon;
			case 'error':
				return closeIcon;
			case 'warning':
				return checkIcon; // Use check icon for warning too
			case 'info':
			default:
				return checkIcon; // Use check icon for info
		}
	}
</script>

<div class="toast-container" role="region" aria-label="Notifications" aria-live="polite">
	{#each $notifications as notification (notification.id)}
		<div
			class="toast toast-{notification.type}"
			transition:fly={{ y: 30, duration: 300 }}
			animate:flip={{ duration: 300 }}
			role="alert"
			aria-atomic="true"
		>
			<div class="toast-content">
				<div class="toast-icon">
					<Icon src={getIcon(notification.type)} size={20} />
				</div>
				<div class="toast-message">{notification.message}</div>
			</div>
			<button
				class="toast-close"
				onclick={() => removeNotification(notification.id)}
				aria-label="Close notification"
			>
				<Icon src={closeIcon} size={16} />
			</button>
		</div>
	{/each}
</div>

<style>
	.toast-container {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		z-index: 9999;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		max-width: 400px;
		pointer-events: none;
	}

	.toast {
		pointer-events: auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.25rem;
		border-radius: 2rem;
		background: rgba(20, 20, 20, 0.95);
		border: 1px solid rgba(255, 255, 255, 0.2);
		color: white;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.toast-content {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex: 1;
	}

	.toast-icon {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.toast-message {
		flex: 1;
		word-wrap: break-word;
	}

	.toast-close {
		background: transparent;
		border: none;
		color: rgba(255, 255, 255, 0.6);
		cursor: pointer;
		padding: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.25rem;
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.toast-close:hover {
		background: rgba(255, 255, 255, 0.1);
		color: white;
	}

	/* Toast type variants */
	.toast-success {
		border-color: #10b981;
	}

	.toast-success .toast-icon {
		color: #10b981;
	}

	.toast-error {
		border-color: #ef4444;
	}

	.toast-error .toast-icon {
		color: #ef4444;
	}

	.toast-warning {
		border-color: #f59e0b;
	}

	.toast-warning .toast-icon {
		color: #f59e0b;
	}

	.toast-info {
		border-color: var(--color-accent);
	}

	.toast-info .toast-icon {
		color: var(--color-accent);
	}

	/* Mobile responsive */
	@media (max-width: 600px) {
		.toast-container {
			left: 1rem;
			right: 1rem;
			bottom: 1rem;
			max-width: none;
		}

		.toast {
			padding: 0.875rem 1rem;
			font-size: 0.9rem;
		}
	}
</style>
