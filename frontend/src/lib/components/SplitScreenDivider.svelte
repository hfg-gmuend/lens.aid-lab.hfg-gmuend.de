<script>
	import Icon from './Icon.svelte';
	import arrowLeft from '$lib/assets/icons/arrow-left.svg?raw';
	import arrowRight from '$lib/assets/icons/arrow-right.svg?raw';
	import refresh from '$lib/assets/icons/refresh.svg?raw';

	let { onTopClick = () => {}, onBottomClick = () => {} } = $props();
</script>

<!-- Top handle -->
<button class="handle handle-top" onclick={onTopClick} aria-label="Top handle">
	<Icon src={arrowRight} width={80} height={20} inverted />
</button>

<!-- Bottom handle -->
<button class="handle handle-bottom" onclick={onBottomClick} aria-label="Bottom handle">
	<!-- <Icon src={refresh} size={20} /> -->
	<Icon src={arrowRight} width={80} height={20} />
</button>

<style>
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
		z-index: 10;
		cursor: pointer;
		border: none;
		outline: none;
		transition: all 0.2s ease;
	}

	.handle:hover {
		transform: translateX(-50%) scale(1.05);
	}

	.handle :global(span) {
		color: white;
	}

	.handle-top {
		top: 2em;
	}

	.handle-bottom {
		bottom: 2em;
	}

	/* Hide handles on mobile */
	@media (max-width: 600px) {
		.handle {
			display: none;
		}
	}
</style>
