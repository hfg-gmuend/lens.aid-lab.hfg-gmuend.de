<script>
	let { src, size = 24, class: className = '' } = $props();
</script>

<span class="inline-flex items-center justify-center {className}" style="width: {size}px; height: {size}px;">
	{@html src}
</span>

<style>
	span :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
