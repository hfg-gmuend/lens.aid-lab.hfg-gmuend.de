<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Toast from '$lib/components/Toast.svelte';
	import NetworkStatus from '$lib/components/NetworkStatus.svelte';

	let { children } = $props();

	onMount(() => {
		// Register service worker
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker
				.register('/service-worker.js')
				.then((registration) => {
					console.log('Service Worker registered:', registration.scope);
				})
				.catch((error) => {
					console.warn('Service Worker registration failed:', error);
				});
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="manifest" href="/manifest.json" />
	<meta name="theme-color" content="#FF6B4A" />
	<meta name="mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
	<meta name="apple-mobile-web-app-title" content="Future Lens" />
	<!-- <link rel="apple-touch-icon" href="/icon-192.png" /> -->
</svelte:head>

{@render children()}
<Toast />
<NetworkStatus />
