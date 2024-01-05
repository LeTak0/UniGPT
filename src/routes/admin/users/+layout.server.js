import { getUsers } from '$lib/server/database';
import { validateRole } from '$lib/server/sessionHelper';
import { redirect } from '@sveltejs/kit';


/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {
	if (!await validateRole(locals, 'admin')) throw redirect(307, '/login');

	let users = await getUsers();

	return {
		users: users
	};
}