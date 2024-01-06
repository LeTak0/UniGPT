import { getUsers } from '$lib/server/database';
import { validateRole } from '$lib/server/sessionHelper';
import { redirect } from '@sveltejs/kit';


/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, depends }) {
	if (!await validateRole(locals, 'admin')) throw redirect(307, '/login');

	let users = await getUsers();

	depends("app:admin:users");

	return {
		users: users
	};
}