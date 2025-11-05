<script>
	import { onMount, onDestroy } from 'svelte';
	import SplitScreenDivider from '$lib/components/SplitScreenDivider.svelte';
	import Icon from '$lib/components/Icon.svelte';
	import ControlBar from '$lib/components/ControlBar.svelte';
	import History from '$lib/components/History.svelte';
	import PanelControls from '$lib/components/PanelControls.svelte';
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
	let historyViewMode = $state('grid'); // 'grid' or 'large'


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
				text: promptValue,
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

			<PanelControls
				position="top-left"
				{cameraActive}
				onCamera={handleCamera}
				onUpload={handleUpload}
			/>
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

			<PanelControls
				position="bottom-right"
				downloadDisabled={!resultImage}
				onDownload={handleDownload}
			/>
		</div>

		<!-- Handles with functionality -->
		<SplitScreenDivider onTopClick={handleReuse} onBottomClick={handleTransfer} />
	</div>

	<!-- Bottom control bar -->
	<ControlBar bind:promptValue bind:denoise />

	<!-- History Section -->
	<History
		{history}
		bind:viewMode={historyViewMode}
		onLoadItem={loadFromHistory}
		onClearHistory={clearHistory}
	/>
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

	/* Responsive layout for mobile */
	@media (max-width: 600px) {
		.main-viewport {
			flex-direction: column;
		}

		.panel {
			width: 100% !important;
			aspect-ratio: 1 / 1;
		}
	}
</style>
