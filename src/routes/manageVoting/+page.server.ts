import type { Actions } from "@sveltejs/kit";
import type { RequestEvent } from "../$types";
import { getContestants } from "$lib/server/services/contestant";

export async function load(event: RequestEvent) {
  const contestants = await getContestants();

  return {contestants};
}

export const actions: Actions = {
  default: async ({ request }) => {},
};
