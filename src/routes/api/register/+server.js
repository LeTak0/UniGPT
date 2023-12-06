import { error } from '@sveltejs/kit';
import { createUser } from '$lib/server/database';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	let { username, password } = await request.json();

	await createUser(username, password).catch((err) => {
		throw error(401, err.message);
	});

    // Respond with success
    return new Response(JSON.stringify({ success: true }));
}


