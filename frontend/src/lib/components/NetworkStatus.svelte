<script>
	import { networkStatus } from '$lib/utils/network.js';
	import { fly } from 'svelte/transition';
	import Icon from './Icon.svelte';
	import wifiIcon from '$lib/assets/icons/wifi.svg?raw';
	import wifiOffIcon from '$lib/assets/icons/wifi-off.svg?raw';

	let showIndicator = $state(false);
	let hideTimeout = null;

	$effect(() => {
		// Show indicator when going offline
		if (!$networkStatus.online) {
			showIndicator = true;
			if (hideTimeout) clearTimeout(hideTimeout);
		} else {
			// When coming back online, show briefly then hide
			if (showIndicator) {
				hideTimeout = setTimeout(() => {
					showIndicator = false;
				}, 3000);
			}
		}
	});
</script>

{#if showIndicator}
	<div
		class="network-status"
		class:offline={!$networkStatus.online}
		transition:fly={{ y: -20, duration: 300 }}
		role="status"
		aria-live="polite"
	>
		<div class="status-content">
			<Icon src={$networkStatus.online ? wifiIcon : wifiOffIcon} size={18} />
			<span class="status-text">
				{$networkStatus.online ? 'Back online' : 'No connection'}
			</span>
		</div>
	</div>
{/if}

<style>
	.network-status {
		position: fixed;
		top: 1rem;
		right: 1rem;
		z-index: 9998;
		display: flex;
		align-items: center;
		padding: 0.75rem 1.25rem;
		border-radius: 2rem;
		background: rgba(20, 20, 20, 0.95);
		border: 1px solid var(--color-accent);
		color: white;
		font-size: 0.9rem;
		pointer-events: none;
	}

	.network-status.offline {
		border-color: #ef4444;
	}

	.status-content {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.status-text {
		white-space: nowrap;
	}

	/* Mobile responsive */
	@media (max-width: 600px) {
		.network-status {
			left: 1rem;
			right: 1rem;
			justify-content: center;
		}
	}
</style>
