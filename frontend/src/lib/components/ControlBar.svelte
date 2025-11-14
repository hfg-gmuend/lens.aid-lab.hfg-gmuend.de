<script>
	import Icon from './Icon.svelte';
	import book from '$lib/assets/icons/book.svg?raw';

	let { promptValue = $bindable(), denoise = $bindable(), onOpenLibrary } = $props();

	const MAX_LENGTH = 500;

	$effect(() => {
		// Trim prompt if it exceeds max length
		if (promptValue && promptValue.length > MAX_LENGTH) {
			promptValue = promptValue.slice(0, MAX_LENGTH);
		}
	});
</script>

<div class="control-bar">
	<div class="prompt-input-container">
		<input
			type="text"
			bind:value={promptValue}
			placeholder="Your prompt here"
			class="prompt-input"
			maxlength={MAX_LENGTH}
			aria-label="Enter your prompt"
		/>
		<button class="library-button" onclick={onOpenLibrary} aria-label="Open prompt library">
			<Icon src={book} size={24} />
		</button>
		{#if promptValue}
			<span class="char-counter" class:warning={promptValue.length > MAX_LENGTH * 0.9}>
				{promptValue.length}/{MAX_LENGTH}
			</span>
		{/if}
	</div>

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

<style>

	*:focus {
    outline: none;
}

	.control-bar {
		width: 100%;
		max-width: 1200px;
		display: flex;
		align-items: center;
		gap: 2rem;
		flex-wrap: wrap;
	}

	.prompt-input-container {
		position: relative;
		flex: 1;
		min-width: 300px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.prompt-input {
		flex: 1;
		padding: 1rem 1.5rem;
		padding-right: 3.5rem;
		border-radius: 2rem;
		border: 2px solid rgba(255, 255, 255, 0.2);
		background-color: transparent;
		color: white;
		font-size: 1rem;
		outline: none;
		transition: border-color 0.2s ease;
	}

	.library-button {
		position: absolute;
		right: 1rem;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		border: 2px solid rgba(255, 255, 255, 0.2);
		background: transparent;
		color: rgba(255, 255, 255, 0.6);
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.library-button:hover {
		border-color: var(--color-accent);
		background: var(--color-accent);
		color: white;
		transform: scale(1.05);
	}

	.char-counter {
		position: absolute;
		bottom: -1.5rem;
		right: 1rem;
		font-size: 0.75rem;
		color: rgba(255, 255, 255, 0.4);
		font-variant-numeric: tabular-nums;
	}

	.char-counter.warning {
		color: #f59e0b;
	}

	.prompt-input::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.prompt-input:focus {
		border-color: var(--color-accent);
		outline: none;
    	box-shadow: none;
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

	/* Responsive layout for mobile */
	@media (max-width: 600px) {
		.control-bar {
			flex-direction: column;
			gap: 1.5rem;
		}

		.prompt-input-container,
		.slider-container {
			width: 100%;
			min-width: unset;
		}

		.char-counter {
			bottom: -1.25rem;
			font-size: 0.7rem;
		}
	}
</style>
