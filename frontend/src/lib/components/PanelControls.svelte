<script>
	import Icon from './Icon.svelte';
	import upload from '$lib/assets/icons/upload.svg?raw';
	import camera from '$lib/assets/icons/camera.svg?raw';
	import check from '$lib/assets/icons/check.svg?raw';
	import download from '$lib/assets/icons/download.svg?raw';

	let {
		position = 'top-left', // 'top-left' or 'bottom-right'
		cameraActive = false,
		checkDisabled = false,
		downloadDisabled = false,
		onCamera = () => {},
		onUpload = () => {},
		onCheck = () => {},
		onDownload = () => {}
	} = $props();
</script>

<div class="panel-controls controls-{position}">
	{#if position === 'top-left'}
		<button class="icon-button" onclick={onUpload} aria-label="Upload">
			<Icon src={upload} size={28} />
		</button>
		<button class="icon-button" class:active={cameraActive} onclick={onCamera} aria-label="Camera">
			<Icon src={camera} size={28} />
		</button>
	{:else}
		<button class="icon-button" onclick={onCheck} disabled={checkDisabled} aria-label="Save to history">
			<Icon src={check} size={28} />
		</button>
		<button
			class="icon-button"
			onclick={onDownload}
			disabled={downloadDisabled}
			aria-label="Download"
		>
			<Icon src={download} size={28} />
		</button>
	{/if}
</div>

<style>
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
</style>
