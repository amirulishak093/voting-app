<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import { invalidateAll } from "$app/navigation";
  import { loading } from "$lib/store";
  import { Avatar, Button } from "flowbite-svelte";

  export let data

 $: selectedContestantId = ''
</script>

<div class="w-full max-w-md mx-auto">
  <div class="px-4 pb-4">
    <h1 class="text-center font-bold text-2xl text-slate-900">Manage Voting</h1>

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
      class="relative overflow-x-auto shadow-md sm:rounded-lg"
    >
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
          <tr>
            <th scope="col" class="px-6 py-3"> Region </th>
            <th scope="col" class="px-6 py-3"> Action </th>
          </tr>
        </thead>
        <tbody>
          {#each data.contestants as contestant (contestant.id)}
            <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
              <th
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                <div class="flex items-center gap-x-2">
                  <Avatar src={contestant.image} rounded />
                  {contestant.name}
                </div>
              </th>
              <td class="px-6 py-4">
                <Button
                  on:click={() => {
                    selectedContestantId = contestant.id
                  }}
                  type="submit">{contestant.enabled ? 'Disable' : 'Enable'}</Button
                >
              </td>
            </tr>
          {/each}
          <tr>
                <Button type="submit">{data.contestants[0].enabled ? 'Disable All' : 'Enable All'}</Button>
          </tr>

        </tbody>
      </table>
      <input name="contestantId" type="hidden" value={selectedContestantId} />
    </form>
  </div>
</div>
