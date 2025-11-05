<script>
	import ArrowLeftIcon from './icons/ArrowLeftIcon.svelte';
	import ArrowRightIcon from './icons/ArrowRightIcon.svelte';
	import RefreshIcon from './icons/RefreshIcon.svelte';

	let { onDrag = (deltaX) => {} } = $props();

	let isDragging = $state(false);
	let startX = $state(0);

	function handlePointerDown(e) {
		isDragging = true;
		startX = e.clientX;
		e.currentTarget.setPointerCapture(e.pointerId);
	}

	function handlePointerMove(e) {
		if (!isDragging) return;

		const deltaX = e.clientX - startX;
		startX = e.clientX;
		onDrag(deltaX);
	}

	function handlePointerUp(e) {
		isDragging = false;
		e.currentTarget.releasePointerCapture(e.pointerId);
	}
</script>

<div
	class="divider-container"
	role="separator"
	aria-orientation="vertical"
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={handlePointerUp}
	style="cursor: col-resize;"
>
	<!-- Top handle -->
	<div class="handle handle-top">
		<ArrowLeftIcon size={20} class="icon" />
	</div>

	<!-- Bottom handle -->
	<div class="handle handle-bottom">
		<RefreshIcon size={20} class="icon" />
		<ArrowRightIcon size={20} class="icon" />
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
		touch-action: none;
		user-select: none;
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
		padding: 0.75rem 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		cursor: col-resize;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
	}

	.handle-top {
		top: 10%;
	}

	.handle-bottom {
		bottom: 10%;
	}

	.handle :global(.icon) {
		color: white;
		flex-shrink: 0;
	}
</style>
