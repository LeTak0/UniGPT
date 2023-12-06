/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals }) {

	return {
		username: locals.session?.username,
		role: locals.session?.role
	};
}