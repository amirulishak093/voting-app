import { getVoteResults } from '$lib/server/services/vote';

export async function load() {
	const voteResults = await getVoteResults();

	return { voteResults };
}
