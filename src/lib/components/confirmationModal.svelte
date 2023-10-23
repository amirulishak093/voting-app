<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import { selected, openModal } from '$lib/store';

	function closeModal() {
		$openModal = false;
	}
</script>

<Modal bind:open={$openModal} size="xs">
	<div class="text-center">
		<p class="mb-5 text-lg font-normal text-slate-900">
			Are you sure you want to vote for <span class="font-bold">{$selected.name}</span>?
		</p>
		<Button on:click={closeModal} type="submit" color="blue" class="mr-2">Yes</Button>
		<Button on:click={closeModal} color="alternative">No</Button>
	</div>
</Modal>
