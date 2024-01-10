import { getChats } from '$lib/server/database';
import { validateRole } from '$lib/server/sessionHelper';
import { redirect } from '@sveltejs/kit';


/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals , depends}) {
	if (!await validateRole(locals, 'user')) throw redirect(307, '/login');

	let chats = await getChats(locals.session.username);

	depends("app:user:chats")

	return {
		chats:chats
	};
}