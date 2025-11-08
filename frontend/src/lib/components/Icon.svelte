<script>
	let {
		src,
		size = 24,
		width = 24,
		height = 24,
		inverted = false,
		class: className = ''
	} = $props();
</script>

<span
	class="inline-flex items-center justify-center {className}"
	style="width: {width ?? size}px; height: {height ?? size}px; {inverted
		? 'transform: scaleX(-1);'
		: ''}"
>
	{@html src}
</span>

<style>
	span :global(svg) {
		width: 100%;
		height: 100%;
		display: block;
	}
</style>
