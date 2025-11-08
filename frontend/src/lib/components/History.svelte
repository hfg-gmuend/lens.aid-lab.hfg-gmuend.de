<script>
	import Icon from './Icon.svelte';
	import HistoryGroup from './HistoryGroup.svelte';
	import grid from '$lib/assets/icons/grid.svg?raw';
	import rows from '$lib/assets/icons/rows.svg?raw';
	import close from '$lib/assets/icons/close.svg?raw';

	let {
		history,
		onLoadItem,
		onDeleteItem,
		onDeleteGroup,
		onClearHistory,
		viewMode = $bindable('grid'),
		groupMode = $bindable('grouped')
	} = $props();

	function toggleView() {
		viewMode = viewMode === 'grid' ? 'large' : 'grid';
	}

	function toggleGroupMode() {
		groupMode = groupMode === 'grouped' ? 'standard' : 'grouped';
	}

	function handleDelete(event, item) {
		event.stopPropagation(); // Prevent triggering the load action
		onDeleteItem(item.id);
	}

	// Convert grouped data to flat list for standard view
	function getFlatHistory(groupedHistory) {
		const flat = [];
		groupedHistory.forEach((group) => {
			group.variations.forEach((variation) => {
				flat.push({
					id: variation.id,
					timestamp: variation.timestamp,
					inputImage: group.inputImage,
					resultImage: variation.resultImage,
					prompt: variation.prompt,
					denoise: variation.denoise,
					seed: variation.seed
				});
			});
		});
		return flat.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
	}

	let displayHistory = $derived(groupMode === 'standard' ? getFlatHistory(history) : history);
</script>

{#if history.length > 0}
	<div class="history-section">
		<div class="history-header">
			<h2 class="history-title">History</h2>
			<div class="history-controls">
				<button class="history-toggle" onclick={toggleGroupMode} aria-label="Toggle grouped view">
					{groupMode === 'grouped' ? 'Standard' : 'Grouped'}
				</button>
				<button
					class="history-toggle hide-on-mobile"
					onclick={toggleView}
					aria-label="Toggle history view"
				>
					<Icon src={viewMode === 'grid' ? rows : grid} size={20} />
				</button>
				<button class="history-clear" onclick={onClearHistory}>Clear All</button>
			</div>
		</div>
		<div class="history-grid" class:large-view={viewMode === 'large'}>
			{#if groupMode === 'grouped'}
				{#each displayHistory as group (group.id)}
					<HistoryGroup
						{group}
						{onLoadItem}
						{onDeleteItem}
						{onDeleteGroup}
						isLargeView={viewMode === 'large'}
					/>
				{/each}
			{:else}
				{#each displayHistory as item (item.id)}
					<button
						class="history-item"
						onclick={() => onLoadItem(item)}
						onkeydown={(e) => e.key === 'Enter' && onLoadItem(item)}
						aria-label="Load history item: {item.prompt}"
					>
						<div
							class="delete-button"
							role="button"
							tabindex="0"
							onclick={(e) => handleDelete(e, item)}
							onkeydown={(e) => e.key === 'Enter' && handleDelete(e, item)}
							aria-label="Delete this history item"
						>
							<Icon src={close} size={16} />
						</div>
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
			{/if}
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
		padding: 0.5rem 1rem;
		border-radius: 0.5rem;
		border: 1px solid var(--color-accent);
		background-color: transparent;
		color: var(--color-accent);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
		font-size: 0.9rem;
		white-space: nowrap;
	}

	.history-toggle:hover {
		background-color: var(--color-accent);
		color: white;
	}

	.hide-on-mobile {
		display: flex;
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
		position: relative;
	}

	.history-item:hover {
		border-color: var(--color-accent);
		background-color: rgba(255, 107, 74, 0.1);
	}

	.delete-button {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.3);
		background-color: rgba(0, 0, 0, 0.7);
		color: white;
		font-size: 1.5rem;
		line-height: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		opacity: 0;
		transition:
			opacity 0.2s ease,
			background-color 0.2s ease;
		z-index: 10;
		padding: 0;
	}

	.history-item:hover .delete-button {
		opacity: 1;
	}

	.delete-button:hover {
		background-color: rgba(255, 107, 74, 1);
		border-color: rgba(255, 107, 74, 1);
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
		width: 40%;
		flex-shrink: 0;
		aspect-ratio: 1 / 1;
		object-fit: cover;
		border-radius: 0.5rem;
	}

	.history-arrow {
		color: var(--color-accent);
		font-size: 1.5rem;
		font-weight: bold;
		flex-shrink: 0;
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
		.hide-on-mobile {
			display: none;
		}

		.history-grid {
			grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		}

		.delete-button {
			opacity: 1;
		}
	}
</style>
