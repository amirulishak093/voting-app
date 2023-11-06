<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import ConfirmationModal from '$lib/components/confirmationModal.svelte';
	import ContestantCard from '$lib/components/contestantCard.svelte';
	import { loading, selected } from '$lib/store';
	import { invalidateAll } from '$app/navigation';

	export let data;
</script>

<div class="w-full max-w-md mx-auto">

	{#if data}
		{#if data.remainingVotes > 0}
			<div class="px-4">
				<h1 class="text-center font-bold text-2xl text-slate-900">Pick Your Favourite</h1>
				<p class="text-center text-lg text-slate-900">
					You have <span class="font-semibold">{data.remainingVotes}</span> votes left
				</p>

				<div class="flex flex-col gap-4 mt-8 pb-4">
					{#each data.contestants as contestant (contestant.id)}
						<ContestantCard
							id={contestant.id}
							name={contestant.name}
							image={contestant.image}
							voted={contestant.voted}
						/>
					{/each}
				</div>
			</div>
		{:else}
			<div class="px-4 flex flex-col items-center gap-y-4">
				<h1 class="text-center font-bold text-2xl text-slate-900">Thank You For Voting</h1>
				<p class="text-center text-lg text-slate-900">
					You have <span class="font-semibold">{data.remainingVotes}</span> votes left
				</p>
			</div>
		{/if}
	{:else}
		<div class="px-4 flex flex-col items-center gap-y-4">
			<h1 class="text-center font-bold text-2xl text-slate-900">Voting is Currently Closed</h1>
		</div>

	{/if}
</div>

<form
	method="post"
	use:enhance={() => {
		$loading = true;
		return async ({ result }) => {
			setTimeout(async () => {
				$loading = false;
			}, 1000);
			await applyAction(result);
			await invalidateAll();
		};
	}}
>
	<ConfirmationModal />

	<input name="userId" type="hidden" value={data.userId} />
	<input name="contestantId" type="hidden" value={$selected.id} />
</form>
