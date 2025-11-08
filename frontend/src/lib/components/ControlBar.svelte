<script>
	let { promptValue = $bindable(), denoise = $bindable() } = $props();
</script>

<div class="control-bar">
	<input type="text" bind:value={promptValue} placeholder="Your prompt here" class="prompt-input" />

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

	/* Responsive layout for mobile */
	@media (max-width: 600px) {
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
