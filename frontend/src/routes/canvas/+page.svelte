<script>
	import { onMount } from 'svelte';
	import { Stage, Layer, Image as KonvaImage, Group, Circle, Text, Arrow } from 'svelte-konva';
	
	const HISTORY_KEY = 'futures-lens-history';
	
	let history = $state([]);
	let stageConfig = $state({
		width: 800,
		height: 600
	});
	let nodes = $state([]);
	let connectors = $state([]);
	let stageRef = $state(null);
	
	// Pan and zoom state
	let scale = $state(1);
	let stageX = $state(0);
	let stageY = $state(0);
	
	const SCALE_BY = 1.01;
	const MIN_SCALE = 0.2;
	const MAX_SCALE = 3;
	
	const INPUT_NODE_SIZE = 120;
	const VARIATION_NODE_SIZE = 100;
	const SPACING_X = 400;
	const SPACING_Y = 300;
	const VARIATION_OFFSET = 200;
	const VARIATION_SPACING_Y = 120;
	
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
					y: row * SPACING_Y + 50 + (varIndex * VARIATION_SPACING_Y),
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
		
		// Calculate required canvas size
		if (loadedNodes.length > 0) {
			const maxX = Math.max(...loadedNodes.map(n => n.x + n.width));
			const maxY = Math.max(...loadedNodes.map(n => n.y + n.height));
			stageConfig.width = Math.max(800, maxX + 100);
			stageConfig.height = Math.max(600, maxY + 100);
		}
		
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
		dragItemId = e.target.id();
		const item = nodes.find((i) => i.id === dragItemId);
		if (item?.component) {
			item.component.node.moveToTop();
		}
	}

	function handleDragMove(e) {
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

	function handleWheel(e) {
		e.evt.preventDefault();
		
		if (!stageRef) return;
		const stage = stageRef.node;
		if (!stage) return;
		
		const oldScale = scale;
		const pointer = stage.getPointerPosition();
		
		const mousePointTo = {
			x: (pointer.x - stage.x()) / oldScale,
			y: (pointer.y - stage.y()) / oldScale
		};
		
		// how to scale? Zoom in? Or zoom out?
		let direction = e.evt.deltaY > 0 ? 1 : -1;
		
		// when we zoom on trackpad, e.evt.ctrlKey is true
		// in that case lets revert direction
		if (e.evt.ctrlKey) {
			direction = -direction;
		}
		
		const newScale = direction > 0 ? oldScale * SCALE_BY : oldScale / SCALE_BY;
		
		// Clamp scale
		scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
		
		const newPos = {
			x: pointer.x - mousePointTo.x * scale,
			y: pointer.y - mousePointTo.y * scale
		};
		
		stageX = newPos.x;
		stageY = newPos.y;
	}
	
	function handleStageDragEnd(e) {
		stageX = e.target.x();
		stageY = e.target.y();
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
	
	onMount(() => {
		loadHistoryFromStorage();
	});
</script>

<div class="visualization-page">
	<div class="header">
		<h1 class="title">Canvas</h1>
		<a href="/" class="back-link">← Back to App</a>
	</div>
	
	<div class="canvas-container">
		{#if nodes.length > 0}
			<!-- Zoom controls -->
			<!-- <div class="zoom-controls">
				<button onclick={zoomIn} class="zoom-btn" title="Zoom In">+</button>
				<button onclick={resetZoom} class="zoom-btn" title="Reset Zoom">
					{Math.round(scale * 100)}%
				</button>
				<button onclick={zoomOut} class="zoom-btn" title="Zoom Out">−</button>
			</div> -->

			<Stage
				{...stageConfig}
				bind:this={stageRef}
				scaleX={scale}
				scaleY={scale}
				x={stageX}
				y={stageY}
				draggable={true}
				onwheel={handleWheel}
				ondragend={handleStageDragEnd}
			>
				<Layer>
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
							draggable={false}
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
		{:else}
			<div class="empty-state">
				<p>No history data available</p>
				<a href="/" class="link">Go back and create some images</a>
			</div>
		{/if}
	</div>
</div>

<style>
	.visualization-page {
		width: 100%;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		padding: 2rem;
		background: linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 100%);
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		max-width: 100%;
	}

	.title {
		font-size: 2rem;
		font-weight: 300;
		font-style: italic;
		color: white;
		margin: 0;
	}

	.back-link {
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color-accent);
		background-color: transparent;
		color: var(--color-accent);
		text-decoration: none;
		font-size: 0.9rem;
		transition: all 0.2s ease;
		white-space: nowrap;
	}

	.back-link:hover {
		background-color: var(--color-accent);
		color: white;
	}

	.canvas-container {
		flex: 1;
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: 1rem;
		overflow: auto;
		padding: 2rem;
		position: relative;
	}

	.zoom-controls {
		position: absolute;
		top: 2rem;
		right: 2rem;
		display: flex;
		gap: 0.5rem;
		z-index: 10;
		background-color: rgba(0, 0, 0, 0.7);
		padding: 0.5rem;
		border-radius: 0.5rem;
		backdrop-filter: blur(10px);
	}

	.zoom-btn {
		width: 2.5rem;
		height: 2.5rem;
		border: 1px solid var(--color-accent);
		background-color: rgba(255, 255, 255, 0.1);
		color: white;
		border-radius: 0.25rem;
		cursor: pointer;
		font-size: 1.2rem;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		user-select: none;
	}

	.zoom-btn:hover {
		background-color: var(--color-accent);
		transform: scale(1.05);
	}

	.zoom-btn:active {
		transform: scale(0.95);
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 400px;
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

	@media (max-width: 600px) {
		.visualization-page {
			padding: 1rem;
		}

		.title {
			font-size: 1.5rem;
		}

		.canvas-container {
			padding: 1rem;
		}
	}
</style>
