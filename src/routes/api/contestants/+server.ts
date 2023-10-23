import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { createContestant, getContestants } from '$lib/server/services/contestant';
import type { Prisma } from '@prisma/client';

export async function POST(event: RequestEvent) {
	try {
		const { name, region, image } = await event.request.json();

		await createContestant({ data: { name, region, image } });

		return json({ success: true });
	} catch (error) {
		console.error('Error creating contestant:', error);
		return json(
			{ success: false, error: 'An error occurred while creating the Contestant.' },
			{ status: 500 }
		);
	}
}

export async function GET(event: RequestEvent) {
	try {
		const params = event.url.searchParams;

		const region = params.get('region');
		const take = Number(params.get('take'));
		const skip = Number(params.get('skip'));

		const options: Prisma.ContestantFindManyArgs = {
			where: {
				region: region || undefined
			},
			take: take || undefined,
			skip: skip || undefined
		};

		const contestants = await getContestants(options);

		return json(contestants);
	} catch (error) {
		console.error('Error fetching Contestants:', error);
		return json({ error: 'An error occurred while fetching Contestants.' }, { status: 500 });
	}
}
