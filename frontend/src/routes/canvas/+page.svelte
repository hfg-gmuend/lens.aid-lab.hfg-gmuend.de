<script>
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { Stage, Layer, Image as KonvaImage, Group, Circle, Text, Arrow, Line } from 'svelte-konva';

	const HISTORY_KEY = 'futures-lens-history';

	let history = $state([]);
	let stageConfig = $state({
		width: 800,
		height: 600
	});
	let nodes = $state([]);
	let connectors = $state([]);
	let stageRef = $state(null);

	// Tool state: 'cursor' or 'hand'
	let activeTool = $state('cursor');

	// Pan and zoom state
	let scale = $state(1);
	let stageX = $state(0);
	let stageY = $state(0);

	// Pan state for hand tool
	let isPanning = $state(false);
	let lastPointerPosition = $state(null);

	const SCALE_BY = 1.02; // Smaller increment for smoother zoom
	const MIN_SCALE = 0.1;
	const MAX_SCALE = 5;

	const INPUT_NODE_SIZE = 120;
	const VARIATION_NODE_SIZE = 100;
	const SPACING_X = 400;
	const SPACING_Y = 300;
	const VARIATION_OFFSET = 200;
	const VARIATION_SPACING_Y = 120;

	// Grid configuration
	const GRID_SIZE = 50; // Grid cell size in pixels
	const GRID_COLOR = 'rgba(255, 255, 255, 0.03)';
	const GRID_STROKE_WIDTH = 1;

	// Cache grid lines to avoid recalculation on every frame
	let cachedGridLines = $state({ vertical: [], horizontal: [] });
	let lastGridUpdate = $state({ x: 0, y: 0, scale: 1 });

	// Calculate grid lines based on viewport with throttling
	function updateGridLines() {
		if (!stageConfig.width || !stageConfig.height) return;

		// Only update if moved significantly (throttle updates)
		const dx = Math.abs(stageX - lastGridUpdate.x);
		const dy = Math.abs(stageY - lastGridUpdate.y);
		const dScale = Math.abs(scale - lastGridUpdate.scale);

		if (dx < GRID_SIZE / 2 && dy < GRID_SIZE / 2 && dScale < 0.1) return;

		lastGridUpdate = { x: stageX, y: stageY, scale };

		const startX = Math.floor((-stageX / scale) / GRID_SIZE) * GRID_SIZE;
		const endX = Math.ceil(((-stageX + stageConfig.width) / scale) / GRID_SIZE) * GRID_SIZE;
		const startY = Math.floor((-stageY / scale) / GRID_SIZE) * GRID_SIZE;
		const endY = Math.ceil(((-stageY + stageConfig.height) / scale) / GRID_SIZE) * GRID_SIZE;

		const vertical = [];
		for (let x = startX; x <= endX; x += GRID_SIZE) {
			vertical.push([x, startY, x, endY]);
		}

		const horizontal = [];
		for (let y = startY; y <= endY; y += GRID_SIZE) {
			horizontal.push([startX, y, endX, y]);
		}

		cachedGridLines = { vertical, horizontal };
	}

	function loadHistoryFromStorage() {
		try {
			const stored = localStorage.getItem(HISTORY_KEY);
			if (stored) {
				history = JSON.parse(stored);
				loadImages();
			}
		} catch (error) {
			console.error('Failed to load history from localStorage:', error);
			history = [];
		}
	}

	async function loadImages() {
		const loadedNodes = [];
		const loadedConnectors = [];

		for (let groupIndex = 0; groupIndex < history.length; groupIndex++) {
			const group = history[groupIndex];
			const row = Math.floor(groupIndex / 3);
			const col = groupIndex % 3;

			// Load input image
			const inputImg = new Image();
			inputImg.crossOrigin = 'anonymous';
			inputImg.src = group.inputImage;

			await new Promise((resolve) => {
				inputImg.onload = resolve;
				inputImg.onerror = resolve;
			});

			const inputId = `input-${group.id}`;

			// Add input node
			loadedNodes.push({
				id: inputId,
				image: inputImg,
				x: col * SPACING_X + 50,
				y: row * SPACING_Y + 50,
				width: INPUT_NODE_SIZE,
				height: INPUT_NODE_SIZE,
				type: 'input',
				variationCount: group.variations.length,
				component: null,
				points: null
			});

			// Load variation images
			for (let varIndex = 0; varIndex < group.variations.length; varIndex++) {
				const variation = group.variations[varIndex];
				const varImg = new Image();
				varImg.crossOrigin = 'anonymous';
				varImg.src = variation.resultImage;

				await new Promise((resolve) => {
					varImg.onload = resolve;
					varImg.onerror = resolve;
				});

				const variationId = `variation-${variation.id}`;

				loadedNodes.push({
					id: variationId,
					image: varImg,
					x: col * SPACING_X + 50 + VARIATION_OFFSET,
					y: row * SPACING_Y + 50 + varIndex * VARIATION_SPACING_Y,
					width: VARIATION_NODE_SIZE,
					height: VARIATION_NODE_SIZE,
					type: 'variation',
					prompt: variation.prompt || '',
					denoise: variation.denoise || 0,
					component: null,
					points: null
				});

				// Create connector from input to variation
				loadedConnectors.push({
					id: `connector-${group.id}-${variation.id}`,
					from: inputId,
					to: variationId,
					points: null,
					component: null
				});
			}
		}

		nodes = loadedNodes;
		connectors = loadedConnectors;

		// Initial connector points calculation
		updateConnectors();
	}

	let dragItemId = $state(null);

	function getConnectorPoints(from, to) {
		const dx = to.x - from.x;
		const dy = to.y - from.y;
		const angle = Math.atan2(-dy, dx);

		// Use half width/height for rectangle centers
		const fromCenterX = from.x + from.width / 2;
		const fromCenterY = from.y + from.height / 2;
		const toCenterX = to.x + to.width / 2;
		const toCenterY = to.y + to.height / 2;

		// Calculate edge points for rectangles
		return [
			from.x + from.width, // Right edge of input node
			fromCenterY,
			toCenterX - to.width / 2, // Left edge of variation node
			toCenterY
		];
	}

	function updateConnectors() {
		connectors.forEach((connector) => {
			const fromNode = nodes.find((n) => n.id === connector.from);
			const toNode = nodes.find((n) => n.id === connector.to);

			if (fromNode && toNode) {
				const points = getConnectorPoints(fromNode, toNode);
				connector.points = points;
			}
		});
		// Force reactivity update
		connectors = [...connectors];
	}

	function handleDragStart(e) {
		if (activeTool !== 'cursor') return;
		dragItemId = e.target.id();
		const item = nodes.find((i) => i.id === dragItemId);
		if (item?.component) {
			item.component.node.moveToTop();
		}
	}

	function handleDragMove(e) {
		if (activeTool !== 'cursor') return;
		const nodeId = e.target.id();
		const node = nodes.find((n) => n.id === nodeId);
		if (node) {
			node.x = e.target.x();
			node.y = e.target.y();
			updateConnectors();
		}
	}

	function handleDragEnd() {
		dragItemId = null;
	}

	function handleMouseDown(e) {
		if (activeTool === 'hand') {
			isPanning = true;
			if (!stageRef) return;
			const stage = stageRef.node;
			if (!stage) return;
			lastPointerPosition = stage.getPointerPosition();
		}
	}

	function handleMouseMove(e) {
		if (activeTool === 'hand' && isPanning) {
			if (!stageRef || !lastPointerPosition) return;
			const stage = stageRef.node;
			if (!stage) return;

			const pointer = stage.getPointerPosition();
			const dx = pointer.x - lastPointerPosition.x;
			const dy = pointer.y - lastPointerPosition.y;

			stageX += dx;
			stageY += dy;

			lastPointerPosition = pointer;
			updateGridLines(); // Update grid during pan
		}
	}

	function handleMouseUp(e) {
		if (activeTool === 'hand') {
			isPanning = false;
			lastPointerPosition = null;
		}
	}

	function handleWheel(e) {
		e.evt.preventDefault();
		e.evt.stopPropagation();

		if (!stageRef) return;
		const stage = stageRef.node;
		if (!stage) return;

		const pointer = stage.getPointerPosition();

		// Check if this is a pinch-to-zoom gesture (ctrlKey is set for pinch gestures)
		if (e.evt.ctrlKey) {
			// Zoom behavior
			const oldScale = scale;

			const mousePointTo = {
				x: (pointer.x - stageX) / oldScale,
				y: (pointer.y - stageY) / oldScale
			};

			// Calculate zoom direction and amount
			let delta = e.evt.deltaY;
			
			// Normalize wheel delta for different input devices
			if (e.evt.deltaMode === 1) {
				// DOM_DELTA_LINE
				delta *= 33;
			} else if (e.evt.deltaMode === 2) {
				// DOM_DELTA_PAGE
				delta *= 100;
			}

			// Direct zoom calculation without momentum
			const scaleFactor = Math.exp(-delta * 0.005);
			const newScale = oldScale * scaleFactor;

			// Clamp scale
			scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

			const newPos = {
				x: pointer.x - mousePointTo.x * scale,
				y: pointer.y - mousePointTo.y * scale
			};

			stageX = newPos.x;
			stageY = newPos.y;
			updateGridLines(); // Update grid after zoom
		} else {
			// Pan behavior (two-finger scroll on trackpad)
			let deltaX = e.evt.deltaX;
			let deltaY = e.evt.deltaY;

			// Normalize for different delta modes
			if (e.evt.deltaMode === 1) {
				// DOM_DELTA_LINE - multiply by line height
				deltaX *= 20;
				deltaY *= 20;
			} else if (e.evt.deltaMode === 2) {
				// DOM_DELTA_PAGE
				deltaX *= 100;
				deltaY *= 100;
			}

			// Direct pan without smoothing - stop immediately
			stageX -= deltaX;
			stageY -= deltaY;
			updateGridLines(); // Update grid after pan
		}
	}

	function handleStageDragEnd(e) {
		if (activeTool === 'hand') {
			stageX = e.target.x();
			stageY = e.target.y();
		}
	}

	function handleResize() {
		stageConfig.width = window.innerWidth;
		stageConfig.height = window.innerHeight;
	}

	function zoomIn() {
		const newScale = Math.min(MAX_SCALE, scale * SCALE_BY);
		scale = newScale;
	}

	function zoomOut() {
		const newScale = Math.max(MIN_SCALE, scale / SCALE_BY);
		scale = newScale;
	}

	function resetZoom() {
		scale = 1;
		stageX = 0;
		stageY = 0;
	}

	function handleKeyDown(e) {
		// Ignore if typing in an input field
		if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

		const key = e.key.toLowerCase();
		
		if (key === 'v') {
			e.preventDefault();
			activeTool = 'cursor';
		} else if (key === 'h') {
			e.preventDefault();
			activeTool = 'hand';
		}
	}

	onMount(() => {
		// Initialize stage size with actual window dimensions
		stageConfig.width = window.innerWidth;
		stageConfig.height = window.innerHeight;
		
		loadHistoryFromStorage();
		window.addEventListener('resize', handleResize);
		window.addEventListener('keydown', handleKeyDown);
		updateGridLines(); // Initial grid calculation

		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<div class="canvas-page">
	<!-- Top Navigation -->
	<div class="top-nav">
		<a href="{base}/" class="back-link">← Back to App</a>
	</div>

	<!-- Zoom Display -->
	<div class="zoom-display">
		{Math.round(scale * 100)}%
	</div>

	{#if nodes.length > 0}
		<Stage
			{...stageConfig}
			bind:this={stageRef}
			scaleX={scale}
			scaleY={scale}
			x={stageX}
			y={stageY}
			draggable={false}
			onwheel={handleWheel}
			ondragend={handleStageDragEnd}
			onmousedown={handleMouseDown}
			onmousemove={handleMouseMove}
			onmouseup={handleMouseUp}
			ontouchstart={handleMouseDown}
			ontouchmove={handleMouseMove}
			ontouchend={handleMouseUp}
		>
			<Layer>
				<!-- Grid lines in background -->
				{#each cachedGridLines.vertical as line}
					<Line
						points={line}
						stroke={GRID_COLOR}
						strokeWidth={GRID_STROKE_WIDTH / scale}
						listening={false}
					/>
				{/each}
				{#each cachedGridLines.horizontal as line}
					<Line
						points={line}
						stroke={GRID_COLOR}
						strokeWidth={GRID_STROKE_WIDTH / scale}
						listening={false}
					/>
				{/each}

				<!-- Render arrows first so they appear behind nodes -->
				{#each connectors as connector (connector.id)}
					{#if connector.points}
						<Arrow
							points={connector.points}
							stroke="#ff6b4a"
							fill="#ff6b4a"
							strokeWidth={2}
							pointerLength={10}
							pointerWidth={10}
							listening={false}
						/>
					{/if}
				{/each}

				{#each nodes as node (node.id)}
					<Group
						bind:x={node.x}
						bind:y={node.y}
						id={node.id}
						draggable={activeTool === 'cursor'}
						bind:this={node.component}
						ondragstart={handleDragStart}
						ondragmove={handleDragMove}
						ondragend={handleDragEnd}
					>
							<!-- Main image -->
							<KonvaImage
								image={node.image}
								width={node.width}
								height={node.height}
								cornerRadius={6}
								shadowColor="black"
								shadowBlur={10}
								shadowOpacity={0.3}
							/>

							<!-- Border -->
							<KonvaImage
								image={node.image}
								width={node.width}
								height={node.height}
								cornerRadius={6}
								stroke={node.type === 'input' ? '#ff6b4a' : '#888'}
								strokeWidth={3}
								listening={false}
							/>

							<!-- Count badge for input nodes -->
							{#if node.type === 'input' && node.variationCount > 1}
								<Circle
									x={node.width - 15}
									y={15}
									radius={15}
									fill="#ff6b4a"
									stroke="white"
									strokeWidth={2}
								/>

								<Text
									x={node.width - 15}
									y={15}
									text={node.variationCount.toString()}
									fontSize={14}
									fontStyle="bold"
									fill="white"
									offsetX={7}
									offsetY={7}
									width={14}
									align="center"
								/>
							{/if}

							<!-- Prompt and denoise for variation nodes -->
							{#if node.type === 'variation'}
								<!-- Prompt text -->
								<Text
									x={5}
									y={node.height + 5}
									text={`${node.prompt} (Familiarity: ${node.denoise})`}
									fontSize={10}
									fill="white"
									width={node.width - 10}
									height={35}
									ellipsis={true}
									wrap="char"
									listening={false}
								/>
							{/if}
						</Group>
					{/each}
				</Layer>
			</Stage>

			<!-- Toolbelt -->
			<div class="toolbelt">
				<button
					class="tool-button"
					class:active={activeTool === 'cursor'}
					onclick={() => (activeTool = 'cursor')}
					title="Cursor Tool (V) - Select and move nodes"
				>
					<span class="tool-letter">V</span>
				</button>
				<button
					class="tool-button"
					class:active={activeTool === 'hand'}
					onclick={() => (activeTool = 'hand')}
					title="Hand Tool (H) - Pan canvas"
				>
					<span class="tool-letter">H</span>
				</button>
			</div>
		{:else}
			<div class="empty-state">
				<p>No history data available</p>
				<a href="{base}/" class="link">Go back and create some images</a>
			</div>
		{/if}
</div>

<style>
	.canvas-page {
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
		position: relative;
		cursor: default;
		/* Disable browser smooth scrolling */
		touch-action: none;
		overscroll-behavior: none;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		color: rgba(255, 255, 255, 0.6);
		gap: 1rem;
	}

	.empty-state p {
		font-size: 1.2rem;
		margin: 0;
	}

	.link {
		color: var(--color-accent);
		text-decoration: none;
		border-bottom: 1px solid var(--color-accent);
	}

	.link:hover {
		opacity: 0.8;
	}

	/* Toolbelt */
	.toolbelt {
		position: fixed;
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem;
		background: rgba(20, 20, 20, 0.95);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 0.75rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
		z-index: 1000;
	}

	.tool-button {
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: transparent;
		border: 2px solid transparent;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: all 0.2s ease;
		padding: 0;
		position: relative;
	}

	.tool-letter {
		font-size: 18px;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.6);
		transition: color 0.2s ease;
		user-select: none;
	}

	.tool-button:hover {
		background: rgba(255, 255, 255, 0.05);
	}

	.tool-button:hover .tool-letter {
		color: rgba(255, 255, 255, 0.9);
	}

	.tool-button.active {
		background: rgba(255, 107, 74, 0.15);
		border-color: var(--color-accent);
	}

	.tool-button.active .tool-letter {
		color: var(--color-accent);
	}

	/* Change cursor based on active tool */
	.canvas-page:has(.tool-button.active[title*='Hand']) {
		cursor: grab;
	}

	.canvas-page:has(.tool-button.active[title*='Hand']):active {
		cursor: grabbing;
	}

	/* Top Navigation */
	.top-nav {
		position: fixed;
		top: 2rem;
		left: 1rem;
		z-index: 1000;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		background: rgba(20, 20, 20, 0.95);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 0.75rem;
		color: var(--color-accent);
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 500;
		transition: all 0.2s ease;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
	}

	.back-link:hover {
		background: rgba(255, 107, 74, 0.15);
		border-color: var(--color-accent);
		transform: translateX(-2px);
	}

	/* Zoom Display */
	.zoom-display {
		position: fixed;
		top: 2rem;
		right: 1rem;
		padding: 0.75rem 1.25rem;
		background: rgba(20, 20, 20, 0.95);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 0.75rem;
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.9rem;
		font-weight: 500;
		font-variant-numeric: tabular-nums;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
		z-index: 1000;
		min-width: 70px;
		text-align: center;
	}
</style>
