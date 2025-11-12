<script>
	import { storageMonitor } from '$lib/stores/storageMonitor.js';
	import { onMount } from 'svelte';
	import { notifyWarning, notifyError } from '$lib/stores/notifications.js';

	let lastStatus = 'ok';

	$effect(() => {
		// Notify user when storage status changes
		if ($storageMonitor.status !== lastStatus) {
			if ($storageMonitor.status === 'warning' && lastStatus === 'ok') {
				notifyWarning(`Storage is ${$storageMonitor.percentUsed.toFixed(0)}% full`);
			} else if ($storageMonitor.status === 'critical') {
				notifyError(`Storage is almost full (${$storageMonitor.percentUsed.toFixed(0)}%)`);
			}
			lastStatus = $storageMonitor.status;
		}
	});

	onMount(() => {
		storageMonitor.start();
		return () => storageMonitor.stop();
	});
</script>

{#if $storageMonitor.quota > 0 && $storageMonitor.percentUsed > 0}
	<div class="storage-indicator" class:warning={$storageMonitor.status === 'warning'} class:critical={$storageMonitor.status === 'critical'}>
		<div class="storage-bar">
			<div class="storage-fill" style="width: {$storageMonitor.percentUsed}%"></div>
		</div>
		<span class="storage-text">
			{$storageMonitor.usageInMB}MB / {$storageMonitor.quotaInMB}MB
		</span>
	</div>
{/if}

<style>
	.storage-indicator {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		border-radius: 1rem;
		background: rgba(20, 20, 20, 0.5);
		border: 1px solid rgba(255, 255, 255, 0.2);
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.8);
	}

	.storage-indicator.warning {
		border-color: #f59e0b;
	}

	.storage-indicator.critical {
		border-color: #ef4444;
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}

	.storage-bar {
		width: 80px;
		height: 6px;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 3px;
		overflow: hidden;
	}

	.storage-fill {
		height: 100%;
		background: var(--color-accent);
		transition: width 0.3s ease;
	}

	.storage-indicator.warning .storage-fill {
		background: #f59e0b;
	}

	.storage-indicator.critical .storage-fill {
		background: #ef4444;
	}

	.storage-text {
		white-space: nowrap;
		font-variant-numeric: tabular-nums;
	}

	@media (max-width: 600px) {
		.storage-indicator {
			font-size: 0.7rem;
		}

		.storage-bar {
			width: 60px;
		}
	}
</style>
