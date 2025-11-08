<script>
	import Icon from './Icon.svelte';
	import close from '$lib/assets/icons/close.svg?raw';
	import chevronDown from '$lib/assets/icons/chevron-down.svg?raw';
	import chevronUp from '$lib/assets/icons/chevron-up.svg?raw';
	import { lazyload } from '$lib/utils/lazyload.js';

	let { group, onLoadItem, onDeleteItem, onDeleteGroup, isLargeView = false } = $props();

	let expanded = $state(false);
	let selectedVariation = $state(group.variations[0]);

	function handleVariationClick(variation) {
		selectedVariation = variation;
		onLoadItem({
			inputHash: group.inputHash,
			inputImage: group.inputImage,
			resultImage: variation.resultImage,
			prompt: variation.prompt,
			denoise: variation.denoise,
			seed: variation.seed
		});
	}

	function handleDeleteVariation(event, variation) {
		event.stopPropagation();
		onDeleteItem(variation.id);
	}

	function handleDeleteGroup(event) {
		event.stopPropagation();
		onDeleteGroup(group.id);
	}

	function toggleExpanded() {
		if (group.variations.length > 1) {
			expanded = !expanded;
		}
	}
</script>

<div class="history-group" class:large-view={isLargeView}>
	<div
		class="delete-group-button"
		role="button"
		tabindex="0"
		onclick={handleDeleteGroup}
		onkeydown={(e) => e.key === 'Enter' && handleDeleteGroup(e)}
		aria-label="Delete this history group"
	>
		<Icon src={close} size={16} />
	</div>

	<div class="group-container">
		<!-- Input Image (Left) -->
		<div class="input-section">
			<img use:lazyload={group.inputImage} alt="Input" class="input-image" />
			{#if group.variations.length > 1}
				<div class="variation-count-badge">
					{group.variations.length}
				</div>
			{/if}
		</div>

		<!-- Arrow -->
		<div class="arrow">→</div>

		<!-- Variations (Right) -->
		<div class="variations-section">
			{#if expanded}
				<!-- Expanded: Show all variations in a grid -->
				<div class="variations-grid">
					{#each group.variations as variation (variation.id)}
						<div class="variation-item">
							<button
								class="variation-button"
								onclick={() => handleVariationClick(variation)}
								aria-label="Load variation: {variation.prompt}"
							>
								<img use:lazyload={variation.resultImage} alt="Result" class="variation-image" />
								<div class="variation-overlay">
									<p class="variation-prompt">{variation.prompt}</p>
									<p class="variation-denoise">Familiarity: {variation.denoise.toFixed(2)}</p>
								</div>
							</button>
							<div
								class="delete-variation-button"
								role="button"
								tabindex="0"
								onclick={(e) => handleDeleteVariation(e, variation)}
								onkeydown={(e) => e.key === 'Enter' && handleDeleteVariation(e, variation)}
								aria-label="Delete this variation"
							>
								<Icon src={close} size={12} />
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<!-- Collapsed: Show selected/first variation -->
				<div class="selected-variation">
					<button class="variation-button" onclick={() => handleVariationClick(selectedVariation)}>
						<img use:lazyload={selectedVariation.resultImage} alt="Result" class="variation-image" />
					</button>
					<div class="variation-info">
						<p class="variation-prompt">{selectedVariation.prompt}</p>
						<p class="variation-params">Familiarity: {selectedVariation.denoise.toFixed(2)}</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- Expand/Collapse Button -->
		{#if group.variations.length > 1}
			<button
				class="expand-button"
				onclick={toggleExpanded}
				aria-label={expanded ? 'Collapse variations' : 'Expand variations'}
			>
				<Icon src={expanded ? chevronUp : chevronDown} size={20} />
			</button>
		{/if}
	</div>
</div>

<style>
	.history-group {
		position: relative;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 0.75rem;
		overflow: hidden;
		background-color: rgba(255, 255, 255, 0.05);
		transition: all 0.2s ease;
	}

	.history-group:hover {
		border-color: var(--color-accent);
		background-color: rgba(255, 107, 74, 0.1);
	}

	.delete-group-button {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.3);
		background-color: rgba(0, 0, 0, 0.7);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		opacity: 0;
		transition:
			opacity 0.2s ease,
			background-color 0.2s ease;
		z-index: 20;
	}

	.history-group:hover .delete-group-button {
		opacity: 1;
	}

	.delete-group-button:hover {
		background-color: rgba(255, 107, 74, 1);
		border-color: rgba(255, 107, 74, 1);
	}

	.group-container {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem;
		background-color: rgba(0, 0, 0, 0.3);
		position: relative;
	}

	.input-section {
		position: relative;
		width: 30%;
		flex-shrink: 0;
	}

	.input-image {
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
		border-radius: 0.5rem;
	}

	.variation-count-badge {
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		background-color: rgba(0, 0, 0, 0.8);
		color: var(--color-accent);
		font-size: 0.75rem;
		padding: 0.15rem 0.5rem;
		border-radius: 1rem;
		font-weight: 600;
		border: 1px solid var(--color-accent);
		min-width: 1.5rem;
		text-align: center;
	}

	.arrow {
		color: var(--color-accent);
		font-size: 1.5rem;
		font-weight: bold;
		flex-shrink: 0;
	}

	.variations-section {
		flex: 1;
		min-width: 0;
	}

	.selected-variation {
		display: flex;
		gap: 0.75rem;
		align-items: center;
	}

	.selected-variation .variation-button {
		width: 30%;
		flex-shrink: 0;
	}

	.variation-info {
		flex: 1;
		min-width: 0;
	}

	.variation-prompt {
		color: white;
		font-size: 0.9rem;
		margin: 0 0 0.25rem 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.variation-params {
		color: rgba(255, 255, 255, 0.6);
		font-size: 0.8rem;
		margin: 0;
	}

	.expand-button {
		position: absolute;
		right: 0.5rem;
		bottom: 0.5rem;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		border: 1px solid var(--color-accent);
		background-color: rgba(0, 0, 0, 0.7);
		color: var(--color-accent);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s ease;
		z-index: 5;
	}

	.expand-button:hover {
		background-color: var(--color-accent);
		color: white;
	}

	.variations-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 0.5rem;
	}

	.variation-item {
		position: relative;
	}

	.variation-button {
		width: 100%;
		padding: 0;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 0.5rem;
		overflow: hidden;
		background: none;
		cursor: pointer;
		transition: all 0.2s ease;
		position: relative;
	}

	.variation-button:hover {
		border-color: var(--color-accent);
		transform: scale(1.05);
	}

	.variation-image {
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
		display: block;
	}

	.variation-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
		padding: 0.5rem 0.25rem 0.25rem;
		opacity: 0;
		transition: opacity 0.2s ease;
	}

	.variation-button:hover .variation-overlay {
		opacity: 1;
	}

	.variation-overlay .variation-prompt {
		font-size: 0.7rem;
		margin: 0 0 0.15rem 0;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		color: white;
	}

	.variation-overlay .variation-denoise {
		font-size: 0.6rem;
		margin: 0;
		color: rgba(255, 255, 255, 0.7);
	}

	.delete-variation-button {
		position: absolute;
		top: 0.25rem;
		right: 0.25rem;
		width: 1.5rem;
		height: 1.5rem;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.3);
		background-color: rgba(0, 0, 0, 0.7);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		opacity: 0;
		transition:
			opacity 0.2s ease,
			background-color 0.2s ease;
		z-index: 10;
	}

	.variation-item:hover .delete-variation-button {
		opacity: 1;
	}

	.delete-variation-button:hover {
		background-color: rgba(255, 107, 74, 1);
		border-color: rgba(255, 107, 74, 1);
	}

	/* Large view adjustments */
	.large-view .group-container {
		padding: 1.5rem;
	}

	.large-view .arrow {
		font-size: 2rem;
	}

	.large-view .variation-prompt {
		font-size: 1rem;
		white-space: normal;
	}

	.large-view .variations-grid {
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1rem;
	}

	/* Mobile adjustments */
	@media (max-width: 600px) {
		.delete-group-button,
		.delete-variation-button {
			opacity: 1;
		}

		.input-section {
			width: 35%;
		}

		.selected-variation .variation-button {
			width: 35%;
		}

		.variations-grid {
			grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
		}

		.variation-count-badge {
			font-size: 0.7rem;
			padding: 0.1rem 0.4rem;
		}
	}
</style>
