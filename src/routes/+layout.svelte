<script>
	import '@fontsource/poppins';
	import '@fontsource/poppins/500.css';
	import '@fontsource/poppins/700.css';

	import Header from '$lib/components/header.svelte';
	import '../app.css';
	import { fade } from 'svelte/transition';
	import { loading } from '$lib/store';
	import LoadingSpinner from '$lib/components/loadingSpinner.svelte';
</script>

<div class="relative min-h-screen">
	<Header />
	{#if $loading}
		<LoadingSpinner />
	{:else}
		<div transition:fade={{ delay: 150, duration: 150 }}>
			<slot />
		</div>
	{/if}
</div>
