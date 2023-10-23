import { getVoteResults } from '$lib/server/services/vote';
import { json } from '@sveltejs/kit';

export async function GET() {
	try {
		const voteResults = await getVoteResults();
		return json({ voteResults });
	} catch (error) {
		console.error('Error counting votes:', error);
		return json({ error: 'An error occurred while counting votes.' }, { status: 500 });
	}
}
