<script>
	import Icon from './Icon.svelte';
	import closeIcon from '$lib/assets/icons/close.svg?raw';

	let { inputImage, outputImage, onClose } = $props();

	let sliderPosition = $state(50);
	let isDragging = $state(false);

	function handleMouseDown() {
		isDragging = true;
	}

	function handleMouseUp() {
		isDragging = false;
	}

	function handleMouseMove(e) {
		if (!isDragging) return;

		const container = e.currentTarget;
		const rect = container.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const percentage = (x / rect.width) * 100;
		sliderPosition = Math.max(0, Math.min(100, percentage));
	}

	function handleTouchMove(e) {
		if (!isDragging) return;

		const container = e.currentTarget;
		const rect = container.getBoundingClientRect();
		const touch = e.touches[0];
		const x = touch.clientX - rect.left;
		const percentage = (x / rect.width) * 100;
		sliderPosition = Math.max(0, Math.min(100, percentage));
	}
</script>

<svelte:window onmouseup={handleMouseUp} ontouchend={handleMouseUp} />

<div class="comparison-overlay" onclick={onClose} role="presentation">
	<div class="comparison-container" onclick={(e) => e.stopPropagation()} role="dialog" aria-label="Image Comparison" tabindex="-1">
		<div class="comparison-header">
			<h2>Before / After Comparison</h2>
			<button class="close-button" onclick={onClose} aria-label="Close comparison">
				<Icon src={closeIcon} size={24} />
			</button>
		</div>

		<div
			class="comparison-viewer"
			onmousedown={handleMouseDown}
			onmousemove={handleMouseMove}
			ontouchstart={handleMouseDown}
			ontouchmove={handleTouchMove}
			role="img"
			aria-label="Comparison slider"
		>
			<!-- After image (full) -->
			<div class="image-container after">
				<img src={outputImage} alt="After" />
				<span class="image-label after-label">After</span>
			</div>

			<!-- Before image (clipped) -->
			<div class="image-container before" style="clip-path: inset(0 {100 - sliderPosition}% 0 0);">
				<img src={inputImage} alt="Before" />
				<span class="image-label before-label">Before</span>
			</div>

			<!-- Slider handle -->
			<div class="slider-handle" style="left: {sliderPosition}%;">
				<div class="handle-line"></div>
				<div class="handle-grip">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
						<path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
						<path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
					</svg>
				</div>
			</div>
		</div>

		<div class="comparison-controls">
			<input
				type="range"
				min="0"
				max="100"
				bind:value={sliderPosition}
				class="position-slider"
				aria-label="Comparison position"
			/>
		</div>
	</div>
</div>

<style>
	.comparison-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.95);
		backdrop-filter: blur(5px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 2000;
		padding: 1rem;
	}

	.comparison-container {
		background: #000000;
		border-radius: 1.5rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		width: 100%;
		max-width: 1200px;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
	}

	.comparison-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.comparison-header h2 {
		margin: 0;
		font-size: 1.5rem;
		font-weight: 300;
		color: white;
	}

	.close-button {
		background: transparent;
		border: none;
		color: rgba(255, 255, 255, 0.6);
		cursor: pointer;
		padding: 0.5rem;
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.5rem;
		transition: all 0.2s ease;
		width: 2.5rem;
		height: 2.5rem;
	}

	.close-button:hover {
		background: rgba(255, 255, 255, 0.1);
		color: white;
	}

	.comparison-viewer {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		cursor: ew-resize;
		user-select: none;
		-webkit-user-select: none;
	}

	.image-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.image-container img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		display: block;
	}

	.image-container.before {
		z-index: 2;
	}

	.image-container.after {
		z-index: 1;
	}

	.image-label {
		position: absolute;
		top: 1rem;
		padding: 0.5rem 1rem;
		background: rgba(0, 0, 0, 0.7);
		backdrop-filter: blur(5px);
		color: white;
		font-size: 0.9rem;
		font-weight: 500;
		border-radius: 0.375rem;
		z-index: 10;
	}

	.before-label {
		left: 1rem;
	}

	.after-label {
		right: 1rem;
	}

	.slider-handle {
		position: absolute;
		top: 0;
		bottom: 0;
		transform: translateX(-50%);
		z-index: 3;
		pointer-events: none;
	}

	.handle-line {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		width: 2px;
		background: var(--color-accent);
	}

	.handle-grip {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 3rem;
		height: 3rem;
		background: var(--color-accent);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		pointer-events: all;
		cursor: ew-resize;
	}

	.comparison-controls {
		padding: 1.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.position-slider {
		width: 100%;
		height: 4px;
		border-radius: 2px;
		background: rgba(255, 255, 255, 0.2);
		outline: none;
		-webkit-appearance: none;
		appearance: none;
	}

	.position-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		background: var(--color-accent);
		cursor: pointer;
		border: none;
	}

	.position-slider::-moz-range-thumb {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		background: var(--color-accent);
		cursor: pointer;
		border: none;
	}

	@media (max-width: 600px) {
		.comparison-header h2 {
			font-size: 1.25rem;
		}

		.comparison-viewer {
			aspect-ratio: 1 / 1;
		}

		.handle-grip {
			width: 2.5rem;
			height: 2.5rem;
		}

		.image-label {
			font-size: 0.8rem;
			padding: 0.375rem 0.75rem;
		}
	}
</style>
