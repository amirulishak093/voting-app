import { MAX_VOTE_LIMIT } from '$lib/constants';
import { db } from '../db';
import { getContestants } from './contestant';

// Cast a vote for a contestant
// Parameters:
// - userId: The ID of the user casting the vote.
// - contestantId: The ID of the contestant receiving the vote.
export async function castVote(userId: string, contestantId: string) {
	try {
		// Find the user by their ID
		const user = await db.user.findUnique({
			where: { id: userId }
		});

		// Find the contestant by their ID
		const contestant = await db.contestant.findUnique({
			where: { id: contestantId }
		});

		// Check if the user exists
		if (!user) {
			throw new Error(`User with ID ${userId} does not exist.`);
		}

		// Check if the contestant exists
		if (!contestant) {
			throw new Error(`Contestant with ID ${contestantId} does not exist.`);
		}

		// Count the user's existing votes
		const voteCount = await countUserVotes(userId);

		// Check if the user has reached the maximum vote limit
		if (voteCount >= MAX_VOTE_LIMIT) {
			throw new Error(
				`User with ID ${userId} has reached the maximum vote limit of ${MAX_VOTE_LIMIT}.`
			);
		}

		// Check if the user has already voted for the contestant
		if (await hasUserVotedForContestant(userId, contestantId)) {
			throw new Error(`User with ID ${userId} has already voted for contestant ${contestantId}.`);
		}

		// Create a new vote for the user and contestant
		await db.vote.create({
			data: {
				userId,
				contestantId
			}
		});
	} catch (error) {
		console.error('Error casting vote', error);
		throw new Error('Failed to cast vote');
	} finally {
		await db.$disconnect();
	}
}

// Check if a user has already voted for a contestant
// Parameters:
// - userId: The ID of the user to check for.
// - contestantId: The ID of the contestant to check for.
export async function hasUserVotedForContestant(userId: string, contestantId: string) {
	const existingVote = await db.vote.findFirst({
		where: {
			userId: userId,
			contestantId: contestantId
		}
	});
	return !!existingVote;
}

// Count the total votes cast by a user
// Parameters:
// - userId: The ID of the user to count votes for.
export async function countUserVotes(userId: string) {
	try {
		// Get all votes cast by the user
		const userVotes = await getUserVotes(userId);
		const voteCount = userVotes.length;

		return voteCount;
	} catch (error) {
		console.error('Error counting user votes', error);
		throw new Error('Failed to count user votes');
	} finally {
		await db.$disconnect();
	}
}

// Fetch all votes cast by a user
// Parameters:
// - userId: The ID of the user to fetch votes for.
export async function getUserVotes(userId: string) {
	try {
		// Find the user and include their votes
		const user = await db.user.findUnique({
			where: { id: userId },
			include: {
				votes: true
			}
		});

		// Check if the user exists
		if (!user) {
			throw new Error(`User with ID ${userId} does not exist.`);
		}

		// Return the user's votes
		return user.votes;
	} catch (error) {
		console.error('Error fetching user votes', error);
		throw Error('Failed to fetch user votes');
	} finally {
		await db.$disconnect();
	}
}

// Fetch vote counts for all contestants
export async function getVoteResults() {
	try {
		const contestants = await getContestants();

		const viewCounts = await Promise.all(
			contestants.map(async (contestant) => {
				const voteCount = await db.vote.count({
					where: { contestantId: contestant.id }
				});
				return {
					name: contestant.name,
					voteCount
				};
			})
		);

		return viewCounts;
	} catch (error) {
		console.error('Error retrieving view counts for all contestants', error);
		throw new Error('Failed to retrieve view counts for all contestants');
	}
}
