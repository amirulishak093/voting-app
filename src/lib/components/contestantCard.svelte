<script lang="ts">
	import { openModal, selected } from '$lib/store';

	export let id = '';
	export let name = '';
	export let region = '';
	export let image = '';
	export let voted = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	on:click={() => {
		if (!voted) {
			$openModal = true;
			$selected.id = id;
			$selected.name = name;
		}
	}}
	class="relative w-full h-64 rounded-lg shadow-lg text-center overflow-hidden"
>
	<img src={image} alt="John Doe" class="w-full h-full object-cover rounded-t-lg" />

	{#if voted}
		<div class="absolute inset-0 w-full bg-slate-900 bg-opacity-80 z-20 pointer-events-none">
			<p class="text-white text-xl font-bold flex justify-center items-center h-full">Voted</p>
		</div>
	{/if}

	<div class="absolute left-0 bottom-0 w-full">
		<div class="w-full p-2 bg-slate-900 bg-opacity-40">
			<h2 class="text-white text-xl font-semibold">{name}</h2>
			<p class="text-gray-300">{region}</p>
		</div>
	</div>
</div>
