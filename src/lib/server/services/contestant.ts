import type { Prisma } from '@prisma/client';
import { db } from '../db';

// Create a new contestant.
// Parameters:
// - data: The data for creating a new contestant.
export async function createContestant({ data }: Prisma.ContestantCreateArgs) {
	try {
		// Create a new contestant using the provided data.
		const newContestant = await db.contestant.create({
			data
		});

		// Return the newly created contestant.
		return newContestant;
	} catch (error) {
		console.error('Error creating contestant', error);
		throw new Error('Failed to create contestant');
	}
}

// Retrieve contestants based on specified criteria.
// Parameters:
// - orderBy: Optional sorting criteria.
// - where: Optional filtering criteria.
// - take: Optional number of records to retrieve.
// - skip: Optional number of records to skip.
export async function getContestants({
	orderBy = {},
	where = {},
	take = undefined,
	skip = undefined
}: Prisma.ContestantFindManyArgs = {}) {
	try {
		// Fetch contestants with the provided parameters.
		const contestants = await db.contestant.findMany({
			orderBy,
			where,
			take,
			skip
		});

		// Return the retrieved contestants.
		return contestants;
	} catch (error) {
		console.error('Error fetching contestants', error);
		throw new Error('Failed to fetch contestants');
	}
}
