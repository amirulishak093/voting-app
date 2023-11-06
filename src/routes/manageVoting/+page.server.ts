import type { Actions } from "@sveltejs/kit";
import type { RequestEvent } from "../$types";
import { getContestants, toggleEnabled } from "$lib/server/services/contestant";

export async function load(event: RequestEvent) {
  const contestants = await getContestants();

  return {contestants};
}

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const contestantId = formData.get('contestantId') as string;

    console.log(formData);

    try {
      await toggleEnabled(contestantId)

      return {
        success: true,
        status: 'Form is submitted'
      }

    } catch (error) {
      console.log(error)

      return {
        error
      }
    }
  },
};
