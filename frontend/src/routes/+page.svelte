<script>
	import { onMount, onDestroy } from 'svelte';
	import SplitScreenDivider from '$lib/components/SplitScreenDivider.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import upload from '$lib/assets/icons/upload.svg?raw';
	import camera from '$lib/assets/icons/camera.svg?raw';
	import check from '$lib/assets/icons/check.svg?raw';
	import download from '$lib/assets/icons/download.svg?raw';
	import refresh from '$lib/assets/icons/refresh.svg?raw';

	const API_URL = 'https://api-h34hnr2j2nm2me2d.transferscope.org/';
	const CLIENT_ID = 'web';
	const HISTORY_KEY = 'futures-lens-history';
	const MAX_HISTORY = 20;

	let promptValue = $state('');
	let denoise = $state(0.85); // 0.4-1.0 range, default 0.85
	let seed = $state(-1);

	let canvasElement = $state(null);
	let videoElement = $state(null);
	let context = $state(null);
	let videoStream = $state(null);

	let resultImage = $state(null);
	let cameraActive = $state(false);
	let loading = $state(false);
	let loopFrame = $state(null);
	let history = $state([]);

	const CANVAS_SIZE = 1024;

	// Start camera and live preview
	async function handleCamera() {
		if (cameraActive) {
			stopCamera();
			return;
		}

		try {
			videoStream = await navigator.mediaDevices.getUserMedia({
				audio: false,
				video: {
					facingMode: 'environment',
					width: CANVAS_SIZE,
					height: CANVAS_SIZE
				}
			});
			videoElement.srcObject = videoStream;
			videoElement.play();
			cameraActive = true;
			startLoop();
		} catch (error) {
			console.error('Error accessing camera:', error);
			alert('Failed to access camera. Please check permissions.');
		}
	}

	function stopCamera() {
		if (videoStream) {
			videoStream.getTracks().forEach((track) => track.stop());
			videoStream = null;
		}
		cameraActive = false;
		stopLoop();
	}

	function startLoop() {
		function loop() {
			if (cameraActive && !loading && context && videoElement) {
				context.drawImage(videoElement, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
			}
			loopFrame = requestAnimationFrame(loop);
		}
		loopFrame = requestAnimationFrame(loop);
	}

	function stopLoop() {
		if (loopFrame) {
			cancelAnimationFrame(loopFrame);
			loopFrame = null;
		}
	}

	// Upload image
	function handleUpload() {
		stopCamera();
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = 'image/*';
		input.onchange = async (e) => {
			const file = e.target.files?.[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onload = (e) => {
				const image = new Image();
				image.src = e.target.result;
				image.onload = () => {
					if (!context) return;

					// Calculate aspect ratio fit
					const aspectRatio = image.width / image.height;
					let drawWidth, drawHeight, offsetX, offsetY;

					if (aspectRatio > 1) {
						drawWidth = CANVAS_SIZE * aspectRatio;
						drawHeight = CANVAS_SIZE;
						offsetX = (CANVAS_SIZE - drawWidth) / 2;
						offsetY = 0;
					} else {
						drawWidth = CANVAS_SIZE;
						drawHeight = CANVAS_SIZE / aspectRatio;
						offsetX = 0;
						offsetY = (CANVAS_SIZE - drawHeight) / 2;
					}

					context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
					context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);
				};
			};
			reader.readAsDataURL(file);
		};
		input.click();
	}

	// Transfer - send canvas to API
	async function handleTransfer() {
		if (loading || !canvasElement) return;

		// Freeze camera if active
		if (cameraActive) {
			stopCamera();
		}

		loading = true;

		try {
			// Get image from canvas
			const imageBlob = await new Promise((resolve) => {
				canvasElement.toBlob(resolve, 'image/jpeg', 0.8);
			});

			// Prepare form data
			const formData = new FormData();
			formData.append('file', imageBlob);

			// Build query params
			const params = new URLSearchParams({
				client_id: CLIENT_ID,
				text: promptValue || 'barbie kitchen',
				seed: '-1',
				denoise: denoise.toString(),
				redirect: 'true'
			});

			// Send to API
			const response = await fetch(`${API_URL}lens?${params.toString()}`, {
				mode: 'cors',
				method: 'POST',
				body: formData,
				credentials: 'include'
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// Parse JSON response
			const data = await response.json();

			// Construct full URLs from paths (remove leading slash to avoid double slashes)
			const outputUrl = API_URL + data.output.replace(/^\//, '');
			const inputUrl = API_URL + data.input.replace(/^\//, '');

			// Display result
			resultImage = outputUrl;

			// Save to history with actual values from API
			await saveToHistory(inputUrl, outputUrl, data.prompt, data.denoise, data.seed);
		} catch (error) {
			console.error('Error transferring image:', error);
			alert('Failed to transfer image. Please try again.');
		} finally {
			loading = false;
		}
	}

	// Reuse - copy right panel to left canvas
	function handleReuse() {
		if (!resultImage || !context) return;

		stopCamera();

		const image = new Image();
		image.crossOrigin = 'anonymous'; // Enable CORS to avoid tainted canvas
		image.src = resultImage;
		image.onload = () => {
			context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
			context.drawImage(image, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
		};
	}

	// Download result image
	function handleDownload() {
		if (!resultImage) return;

		const link = document.createElement('a');
		link.href = resultImage;
		const filename = promptValue
			? `futures-lens-${promptValue.replace(/[^a-zA-Z0-9]/g, '_')}.jpg`
			: 'futures-lens.jpg';
		link.download = filename;
		link.click();
	}

	// History management
	async function saveToHistory(inputImageUrl, resultImageUrl, prompt, denoiseVal, seedVal) {
		const historyItem = {
			id: Date.now(),
			timestamp: new Date().toISOString(),
			inputImage: inputImageUrl,
			resultImage: resultImageUrl,
			prompt,
			denoise: denoiseVal,
			seed: seedVal
		};

		// Add to beginning of array
		history = [historyItem, ...history].slice(0, MAX_HISTORY);

		// Save to localStorage
		try {
			localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
		} catch (error) {
			console.error('Failed to save history to localStorage:', error);
		}
	}

	function loadFromHistory(item) {
		if (!context) return;

		stopCamera();

		// Load input image to canvas
		const img = new Image();
		img.crossOrigin = 'anonymous'; // Enable CORS to avoid tainted canvas
		img.src = item.inputImage;
		img.onload = () => {
			context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
			context.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
		};

		// Load result image
		resultImage = item.resultImage;

		// Restore parameters
		promptValue = item.prompt;
		denoise = item.denoise;
		seed = item.seed;
	}

	function loadHistoryFromStorage() {
		try {
			const stored = localStorage.getItem(HISTORY_KEY);
			if (stored) {
				history = JSON.parse(stored);
			}
		} catch (error) {
			console.error('Failed to load history from localStorage:', error);
			history = [];
		}
	}

	function clearHistory() {
		history = [];
		try {
			localStorage.removeItem(HISTORY_KEY);
		} catch (error) {
			console.error('Failed to clear history:', error);
		}
	}

	onMount(() => {
		if (canvasElement) {
			context = canvasElement.getContext('2d', { willReadFrequently: true });
		}
		loadHistoryFromStorage();
	});

	onDestroy(() => {
		stopLoop();
		stopCamera();
	});
</script>

<div class="page-container">
	<!-- Title -->
	<h1 class="title">futures lens</h1>

	<!-- Hidden video element for camera -->
	<video
		bind:this={videoElement}
		width={CANVAS_SIZE}
		height={CANVAS_SIZE}
		autoplay
		playsinline
		muted
		style="display: none;"
	></video>

	<!-- Main viewport with split-screen -->
	<div class="main-viewport">
		<!-- Left Panel (Input) -->
		<div class="panel panel-left">
			<canvas bind:this={canvasElement} width={CANVAS_SIZE} height={CANVAS_SIZE} class="canvas">
			</canvas>

			<div class="panel-controls controls-top-left">
				<button
					class="icon-button"
					class:active={!cameraActive}
					onclick={handleUpload}
					aria-label="Upload"
				>
					<Icon src={upload} size={28} />
				</button>
				<button
					class="icon-button"
					class:active={cameraActive}
					onclick={handleCamera}
					aria-label="Camera"
				>
					<Icon src={camera} size={28} />
				</button>
			</div>
		</div>

		<!-- Right Panel (Output) -->
		<div class="panel panel-right">
			{#if loading}
				<div class="loading-indicator">
					<Icon src={refresh} size={48} class="spin" />
				</div>
			{:else if resultImage}
				<img src={resultImage} alt="Result" class="result-image" />
			{:else}
				<div class="empty-state">
					<p>Click transfer to generate</p>
				</div>
			{/if}

			<div class="panel-controls controls-bottom-right">
				<button
					class="icon-button"
					onclick={handleDownload}
					disabled={!resultImage}
					aria-label="Download"
				>
					<Icon src={download} size={28} />
				</button>
			</div>
		</div>

		<!-- Handles with functionality -->
		<SplitScreenDivider onTopClick={handleReuse} onBottomClick={handleTransfer} />
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
			<label for="denoise-slider" class="slider-label">Familiar</label>
			<input
				id="denoise-slider"
				type="range"
				min="0.4"
				max="1"
				step="0.05"
				bind:value={denoise}
				class="familiarity-slider"
			/>
			<label for="denoise-slider" class="slider-label">Unfamiliar</label>
			<span class="slider-value">{denoise.toFixed(2)}</span>
		</div>
	</div>

	<!-- History Section -->
	{#if history.length > 0}
		<div class="history-section">
			<div class="history-header">
				<h2 class="history-title">History</h2>
				<button class="history-clear" onclick={clearHistory}>Clear All</button>
			</div>
			<div class="history-grid">
				{#each history as item (item.id)}
					<button
						class="history-item"
						onclick={() => loadFromHistory(item)}
						onkeydown={(e) => e.key === 'Enter' && loadFromHistory(item)}
						aria-label="Load history item: {item.prompt}"
					>
						<div class="history-images">
							<img src={item.inputImage} alt="Input" class="history-image history-input" />
							<div class="history-arrow">→</div>
							<img src={item.resultImage} alt="Result" class="history-image history-result" />
						</div>
						<div class="history-info">
							<p class="history-prompt">{item.prompt}</p>
							<p class="history-params">
								<span>Denoise: {item.denoise.toFixed(2)}</span>
							</p>
						</div>
					</button>
				{/each}
			</div>
		</div>
	{/if}
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
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.canvas,
	.result-image {
		width: 100%;
		height: 100%;
		object-fit: contain;
	}

	.canvas {
		position: absolute;
		top: 0;
		left: 0;
	}

	.result-image {
		max-width: 100%;
		max-height: 100%;
	}

	.loading-indicator {
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-accent);
	}

	.loading-indicator :global(.spin) {
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.empty-state {
		color: rgba(255, 255, 255, 0.5);
		text-align: center;
		font-size: 1.1rem;
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

	.icon-button.active {
		background-color: var(--color-accent);
		color: white;
	}

	.icon-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.icon-button:disabled:hover {
		transform: none;
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

	.slider-value {
		color: var(--color-accent);
		font-size: 0.9rem;
		min-width: 3rem;
		text-align: right;
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

	/* History Section */
	.history-section {
		width: 100%;
		max-width: 1400px;
		margin-top: 2rem;
	}

	.history-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.history-title {
		font-size: 1.5rem;
		font-weight: 300;
		color: white;
		margin: 0;
	}

	.history-clear {
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color-accent);
		background-color: transparent;
		color: var(--color-accent);
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.2s ease;
	}

	.history-clear:hover {
		background-color: var(--color-accent);
		color: white;
	}

	.history-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 1rem;
	}

	.history-item {
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 0.75rem;
		overflow: hidden;
		cursor: pointer;
		transition: all 0.2s ease;
		background-color: rgba(255, 255, 255, 0.05);
		width: 100%;
		text-align: left;
		padding: 0;
	}

	.history-item:hover {
		border-color: var(--color-accent);
		transform: scale(1.02);
		background-color: rgba(255, 107, 74, 0.1);
	}

	.history-images {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem;
		gap: 0.5rem;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.history-image {
		width: 45%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
		border-radius: 0.5rem;
	}

	.history-arrow {
		color: var(--color-accent);
		font-size: 1.5rem;
		font-weight: bold;
	}

	.history-info {
		padding: 0.75rem;
	}

	.history-prompt {
		color: white;
		font-size: 0.9rem;
		margin: 0 0 0.5rem 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.history-params {
		color: rgba(255, 255, 255, 0.6);
		font-size: 0.8rem;
		margin: 0;
	}

	.history-params span {
		margin-right: 1rem;
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

		.history-grid {
			grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		}
	}
</style>
