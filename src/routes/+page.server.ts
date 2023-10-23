import { MAX_VOTE_LIMIT } from '$lib/constants';
import { getContestants } from '$lib/server/services/contestant';
import { createUser } from '$lib/server/services/user';
import { castVote, getUserVotes, hasUserVotedForContestant } from '$lib/server/services/vote';
import type { Actions, RequestEvent } from '@sveltejs/kit';

export async function load(event: RequestEvent) {
	const ipAddress = event.getClientAddress().replace(/::ffff:/g, '');

	const user = await createUser({ data: { ipAddress } });

	const contestants = await getContestants();

	const voteCounts = (await getUserVotes(user.id)).length;

	const contestantsWithVoteStatus = await Promise.all(
		contestants.map(async (contestant) => {
			const voted = await hasUserVotedForContestant(user.id, contestant.id);
			return {
				...contestant,
				voted
			};
		})
	);

	return {
		userId: user.id,
		contestants: contestantsWithVoteStatus,
		remainingVotes: MAX_VOTE_LIMIT - voteCounts
	};
}

export const actions: Actions = {
	default: async ({ request }) => {
		const formData = await request.formData();

		const userId = formData.get('userId') as string;
		const contestantId = formData.get('contestantId') as string;

		try {
			await castVote(userId, contestantId);

			return {
				success: true,
				status: 'Form is submitted'
			};
		} catch (error) {
			console.log(error);

			return {
				error
			};
		}
	}
};
