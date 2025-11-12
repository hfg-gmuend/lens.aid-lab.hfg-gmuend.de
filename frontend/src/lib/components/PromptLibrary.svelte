<script>
	import { favoritePrompts, promptHistory } from '$lib/stores/prompts.js';
	import promptPresets from '$lib/data/promptPresets.json';
	import Icon from './Icon.svelte';
	import closeIcon from '$lib/assets/icons/close.svg?raw';

	let { onSelectPrompt, onClose } = $props();

	let activeTab = $state('presets');
	let selectedCategory = $state(promptPresets.categories[0].id);

	const tabs = [
		{ id: 'presets', label: 'Presets' },
		{ id: 'favorites', label: 'Favorites' },
		{ id: 'history', label: 'History' }
	];

	function handleSelectPrompt(prompt) {
		onSelectPrompt(prompt);
		onClose();
	}

	function toggleFavorite(prompt, event) {
		event.stopPropagation();
		favoritePrompts.toggle(prompt);
	}

	function isFavorite(prompt) {
		return $favoritePrompts.includes(prompt);
	}

	function getRandomPrompt() {
		const category = promptPresets.categories.find((c) => c.id === selectedCategory);
		if (category && category.prompts.length > 0) {
			const randomIndex = Math.floor(Math.random() * category.prompts.length);
			return category.prompts[randomIndex];
		}
		return '';
	}

	function handleRandomPrompt() {
		const randomPrompt = getRandomPrompt();
		if (randomPrompt) {
			handleSelectPrompt(randomPrompt);
		}
	}
</script>

<div class="prompt-library-overlay" onclick={onClose} role="presentation">
	<div class="prompt-library" onclick={(e) => e.stopPropagation()} role="dialog" aria-label="Prompt Library" tabindex="-1">
		<div class="library-header">
			<h2>Prompt Library</h2>
			<button class="close-button" onclick={onClose} aria-label="Close prompt library">
				<Icon src={closeIcon} size={24} />
			</button>
		</div>

		<div class="tabs">
			{#each tabs as tab}
				<button
					class="tab"
					class:active={activeTab === tab.id}
					onclick={() => (activeTab = tab.id)}
				>
					{tab.label}
					{#if tab.id === 'favorites' && $favoritePrompts.length > 0}
						<span class="badge">{$favoritePrompts.length}</span>
					{/if}
					{#if tab.id === 'history' && $promptHistory.length > 0}
						<span class="badge">{$promptHistory.length}</span>
					{/if}
				</button>
			{/each}
		</div>

		<div class="library-content">
			{#if activeTab === 'presets'}
				<div class="presets-view">
					<div class="category-selector">
						{#each promptPresets.categories as category}
							<button
								class="category-button"
								class:active={selectedCategory === category.id}
								onclick={() => (selectedCategory = category.id)}
							>
								{category.name}
							</button>
						{/each}
					</div>

					<div class="prompt-actions">
						<button class="action-button" onclick={handleRandomPrompt}>
							Random Prompt
						</button>
					</div>

					<div class="prompts-list">
						{#each promptPresets.categories.find((c) => c.id === selectedCategory)?.prompts || [] as prompt}
							<div class="prompt-item" onclick={() => handleSelectPrompt(prompt)}>
								<span class="prompt-text">{prompt}</span>
								<button
									class="favorite-button"
									class:favorited={isFavorite(prompt)}
									onclick={(e) => toggleFavorite(prompt, e)}
									aria-label={isFavorite(prompt) ? 'Remove from favorites' : 'Add to favorites'}
								>
									{isFavorite(prompt) ? '★' : '☆'}
								</button>
							</div>
						{/each}
					</div>
				</div>
			{:else if activeTab === 'favorites'}
				<div class="favorites-view">
					{#if $favoritePrompts.length === 0}
						<div class="empty-state">
							<p>No favorite prompts yet</p>
							<p class="hint">Star prompts from presets to save them here</p>
						</div>
					{:else}
						<div class="prompts-list">
							{#each $favoritePrompts as prompt}
								<div class="prompt-item" onclick={() => handleSelectPrompt(prompt)}>
									<span class="prompt-text">{prompt}</span>
									<button
										class="favorite-button favorited"
										onclick={(e) => toggleFavorite(prompt, e)}
										aria-label="Remove from favorites"
									>
										★
									</button>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{:else if activeTab === 'history'}
				<div class="history-view">
					{#if $promptHistory.length === 0}
						<div class="empty-state">
							<p>No prompt history yet</p>
							<p class="hint">Your recent prompts will appear here</p>
						</div>
					{:else}
						<div class="prompts-list">
							{#each $promptHistory as historyItem}
								<div class="prompt-item" onclick={() => handleSelectPrompt(historyItem.text)}>
									<div class="prompt-content">
										<span class="prompt-text">{historyItem.text}</span>
										<span class="usage-count">Used {historyItem.usageCount}x</span>
									</div>
									<button
										class="favorite-button"
										class:favorited={isFavorite(historyItem.text)}
										onclick={(e) => toggleFavorite(historyItem.text, e)}
										aria-label={isFavorite(historyItem.text) ? 'Remove from favorites' : 'Add to favorites'}
									>
										{isFavorite(historyItem.text) ? '★' : '☆'}
									</button>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.prompt-library-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		backdrop-filter: blur(5px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.prompt-library {
		background: #000000;
		border-radius: 1.5rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		width: 100%;
		max-width: 800px;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
	}

	.library-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.library-header h2 {
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
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0.5rem;
		transition: all 0.2s ease;
	}

	.close-button:hover {
		background: rgba(255, 255, 255, 0.1);
		color: white;
	}

	.tabs {
		display: flex;
		gap: 0.5rem;
		padding: 1rem 1.5rem 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.tab {
		padding: 0.75rem 1.25rem;
		background: transparent;
		border: none;
		color: rgba(255, 255, 255, 0.6);
		cursor: pointer;
		font-size: 0.95rem;
		border-bottom: 2px solid transparent;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.tab:hover {
		color: white;
	}

	.tab.active {
		color: var(--color-accent);
		border-bottom-color: var(--color-accent);
	}

	.badge {
		background: var(--color-accent);
		color: white;
		padding: 0.125rem 0.5rem;
		border-radius: 1rem;
		font-size: 0.75rem;
		font-weight: 500;
	}

	.library-content {
		flex: 1;
		overflow-y: auto;
		padding: 1.5rem;
	}

	.category-selector {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.category-button {
		padding: 0.5rem 1rem;
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 2rem;
		color: rgba(255, 255, 255, 0.8);
		cursor: pointer;
		font-size: 0.875rem;
		transition: all 0.2s ease;
	}

	.category-button:hover {
		border-color: var(--color-accent);
		color: var(--color-accent);
	}

	.category-button.active {
		background: var(--color-accent);
		border-color: var(--color-accent);
		color: white;
	}

	.prompt-actions {
		margin-bottom: 1rem;
	}

	.action-button {
		padding: 0.75rem 1.25rem;
		background: transparent;
		border: 2px solid var(--color-accent);
		border-radius: 2rem;
		color: var(--color-accent);
		cursor: pointer;
		font-size: 0.9rem;
		transition: all 0.2s ease;
	}

	.action-button:hover {
		background: var(--color-accent);
		color: white;
		transform: scale(1.05);
	}

	.prompts-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.prompt-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		background: transparent;
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 2rem;
		cursor: pointer;
		transition: all 0.2s ease;
		gap: 1rem;
	}

	.prompt-item:hover {
		border-color: var(--color-accent);
		transform: scale(1.02);
	}

	.prompt-content {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		flex: 1;
	}

	.prompt-text {
		color: rgba(255, 255, 255, 0.9);
		font-size: 0.95rem;
		line-height: 1.4;
	}

	.usage-count {
		color: rgba(255, 255, 255, 0.4);
		font-size: 0.8rem;
	}

	.favorite-button {
		background: transparent;
		border: none;
		color: rgba(255, 255, 255, 0.3);
		cursor: pointer;
		font-size: 1.5rem;
		padding: 0.25rem;
		transition: all 0.2s ease;
		flex-shrink: 0;
	}

	.favorite-button:hover {
		color: #fbbf24;
		transform: scale(1.1);
	}

	.favorite-button.favorited {
		color: #fbbf24;
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
		color: rgba(255, 255, 255, 0.5);
	}

	.empty-state p {
		margin: 0.5rem 0;
	}

	.hint {
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.3);
	}

	@media (max-width: 600px) {
		.prompt-library {
			max-height: 95vh;
		}

		.library-header h2 {
			font-size: 1.25rem;
		}

		.tabs {
			padding: 0.75rem 1rem 0;
		}

		.tab {
			padding: 0.625rem 0.875rem;
			font-size: 0.875rem;
		}

		.library-content {
			padding: 1rem;
		}

		.category-selector {
			gap: 0.375rem;
		}

		.category-button {
			padding: 0.375rem 0.75rem;
			font-size: 0.8rem;
		}
	}
</style>
