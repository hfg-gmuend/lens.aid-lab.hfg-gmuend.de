<script>
	import Icon from './Icon.svelte';
	import arrowLeft from '$lib/assets/icons/arrow-left.svg?raw';
	import arrowRight from '$lib/assets/icons/arrow-right.svg?raw';
	import refresh from '$lib/assets/icons/refresh.svg?raw';
</script>

<div class="divider-container" role="presentation" aria-hidden="true">
	<!-- Top handle -->
	<div class="handle handle-top">
		<Icon src={arrowLeft} size={20} class="icon" />
	</div>

	<!-- Bottom handle -->
	<div class="handle handle-bottom">
		<Icon src={refresh} size={20} class="icon" />
		<Icon src={arrowRight} size={20} class="icon" />
	</div>
</div>

<style>
	.divider-container {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		width: 4px;
		transform: translateX(-50%);
		z-index: 10;
		pointer-events: none;
	}

	/* Hide divider on mobile */
	@media (max-width: 600px) {
		.divider-container {
			display: none;
		}
	}

	.handle {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--color-accent);
		border-radius: 999px;
		width: 10em;
		padding: 0.75rem 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
	}

	.handle-top {
		top: 2em;
	}

	.handle-bottom {
		bottom: 2em;
	}

	.handle :global(.icon) {
		color: white;
		flex-shrink: 0;
	}
</style>
