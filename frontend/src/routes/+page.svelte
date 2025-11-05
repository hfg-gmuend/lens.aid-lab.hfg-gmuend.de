<script>
	import SplitScreenDivider from '$lib/components/SplitScreenDivider.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import upload from '$lib/assets/icons/upload.svg?raw';
	import camera from '$lib/assets/icons/camera.svg?raw';
	import check from '$lib/assets/icons/check.svg?raw';
	import download from '$lib/assets/icons/download.svg?raw';

	let promptValue = $state('');
	let sliderValue = $state(80); // default near "Unfamiliar"

	function handleUpload() {
		console.log('Upload clicked');
	}

	function handleCamera() {
		console.log('Camera clicked');
	}

	function handleCheck() {
		console.log('Check clicked');
	}

	function handleDownload() {
		console.log('Download clicked');
	}
</script>

<div class="page-container">
	<!-- Title -->
	<h1 class="title">futures lens</h1>

	<!-- Main viewport with split-screen -->
	<div class="main-viewport">
		<!-- Left Panel (Input) -->
		<div class="panel panel-left">
			<div class="panel-controls controls-top-left">
				<button class="icon-button" onclick={handleUpload} aria-label="Upload">
					<Icon src={upload} size={28} />
				</button>
				<button class="icon-button" onclick={handleCamera} aria-label="Camera">
					<Icon src={camera} size={28} />
				</button>
			</div>
		</div>

		<!-- Right Panel (Output) -->
		<div class="panel panel-right">
			<div class="panel-controls controls-bottom-right">
				<button class="icon-button" onclick={handleCheck} aria-label="Check">
					<Icon src={check} size={28} />
				</button>
				<button class="icon-button" onclick={handleDownload} aria-label="Download">
					<Icon src={download} size={28} />
				</button>
			</div>
		</div>

		<!-- Decorative divider with handles -->
		<SplitScreenDivider />
	</div>

	<!-- Bottom control bar -->
	<div class="control-bar">
		<input
			type="text"
			bind:value={promptValue}
			placeholder="Your prompt here"
			class="prompt-input"
		/>

		<div class="slider-container">
			<label for="familiarity-slider" class="slider-label">Familiar</label>
			<input
				id="familiarity-slider"
				type="range"
				min="0"
				max="100"
				bind:value={sliderValue}
				class="familiarity-slider"
			/>
			<label for="familiarity-slider" class="slider-label">Unfamiliar</label>
		</div>
	</div>
</div>

<style>
	.page-container {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2rem 1rem;
		gap: 2rem;
	}

	.title {
		font-size: 1.875rem;
		font-weight: 300;
		font-style: italic;
		color: white;
		margin: 0;
		text-align: center;
	}

	.main-viewport {
		position: relative;
		width: 100%;
		max-width: 1400px;
		border-radius: 1.5rem;
		overflow: hidden;
		display: flex;
	}

	.panel {
		width: 50%;
		aspect-ratio: 1 / 1;
		position: relative;
	}

	.panel-left {
		background-color: var(--color-panel-light);
	}

	.panel-right {
		background-color: var(--color-panel-dark);
	}

	.panel-controls {
		position: absolute;
		display: flex;
		gap: 1rem;
	}

	.controls-top-left {
		top: 1.5rem;
		left: 1.5rem;
	}

	.controls-bottom-right {
		bottom: 1.5rem;
		right: 1.5rem;
	}

	.icon-button {
		width: 3.5rem;
		height: 3.5rem;
		border-radius: 50%;
		border: 2px solid var(--color-accent);
		background-color: transparent;
		color: var(--color-accent);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.icon-button:hover {
		background-color: var(--color-accent);
		color: white;
		transform: scale(1.05);
	}

	.control-bar {
		width: 100%;
		max-width: 1400px;
		display: flex;
		align-items: center;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.prompt-input {
		flex: 1;
		min-width: 300px;
		padding: 1rem 1.5rem;
		border-radius: 2rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		background-color: transparent;
		color: white;
		font-size: 1rem;
		outline: none;
		transition: border-color 0.2s ease;
	}

	.prompt-input::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.prompt-input:focus {
		border-color: var(--color-accent);
	}

	.slider-container {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex: 1;
		min-width: 300px;
	}

	.slider-label {
		color: white;
		font-size: 1rem;
		white-space: nowrap;
	}

	.familiarity-slider {
		flex: 1;
		height: 4px;
		border-radius: 2px;
		background: rgba(255, 255, 255, 0.3);
		outline: none;
		-webkit-appearance: none;
		appearance: none;
	}

	.familiarity-slider::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		background: white;
		cursor: pointer;
		border: none;
	}

	.familiarity-slider::-moz-range-thumb {
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		background: white;
		cursor: pointer;
		border: none;
	}

	/* Responsive layout for mobile */
	@media (max-width: 600px) {
		.main-viewport {
			flex-direction: column;
		}

		.panel {
			width: 100% !important;
			aspect-ratio: 1 / 1;
		}

		.control-bar {
			flex-direction: column;
			gap: 1.5rem;
		}

		.prompt-input,
		.slider-container {
			width: 100%;
			min-width: unset;
		}
	}
</style>
