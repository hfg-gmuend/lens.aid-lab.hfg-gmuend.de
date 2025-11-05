<script>
	import Icon from './Icon.svelte';
	import grid from '$lib/assets/icons/grid.svg?raw';
	import rows from '$lib/assets/icons/rows.svg?raw';

	let {
		history,
		onLoadItem,
		onClearHistory,
		viewMode = $bindable('grid')
	} = $props();

	function toggleView() {
		viewMode = viewMode === 'grid' ? 'large' : 'grid';
	}
</script>

{#if history.length > 0}
	<div class="history-section">
		<div class="history-header">
			<h2 class="history-title">History</h2>
			<div class="history-controls">
				<button class="history-toggle" onclick={toggleView} aria-label="Toggle history view">
					<Icon src={viewMode === 'grid' ? rows : grid} size={20} />
				</button>
				<button class="history-clear" onclick={onClearHistory}>Clear All</button>
			</div>
		</div>
		<div class="history-grid" class:large-view={viewMode === 'large'}>
			{#each history as item (item.id)}
				<button
					class="history-item"
					onclick={() => onLoadItem(item)}
					onkeydown={(e) => e.key === 'Enter' && onLoadItem(item)}
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
							<span>Familiarity: {item.denoise.toFixed(2)}</span>
						</p>
					</div>
				</button>
			{/each}
		</div>
	</div>
{/if}

<style>
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

	.history-controls {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.history-toggle {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color-accent);
		background-color: transparent;
		color: var(--color-accent);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.history-toggle:hover {
		background-color: var(--color-accent);
		color: white;
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

	.history-grid.large-view {
		grid-template-columns: 1fr;
	}

	.history-grid.large-view .history-item {
		max-width: 100%;
	}

	.history-grid.large-view .history-images {
		padding: 1.5rem;
		gap: 1rem;
	}

	.history-grid.large-view .history-image {
		/* width: 30%;
		max-width: 300px; */
	}

	.history-grid.large-view .history-arrow {
		font-size: 2rem;
	}

	.history-grid.large-view .history-info {
		padding: 1.5rem;
	}

	.history-grid.large-view .history-prompt {
		font-size: 1.1rem;
		white-space: normal;
	}

	.history-grid.large-view .history-params {
		font-size: 0.95rem;
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
		.history-grid {
			grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		}
	}
</style>
