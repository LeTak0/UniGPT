import { deleteSession } from '$lib/server/database';

/** @type {import('./$types').RequestHandler} */
export async function DELETE({ locals, cookies }) {
	await deleteSession(locals?.session?.token || "");

	// Delete cookie
	cookies.delete('auth');

    // Respond with success
    return new Response(JSON.stringify({ success: true }));
}

