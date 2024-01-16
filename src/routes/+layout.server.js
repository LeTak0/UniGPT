/** @type {import('./$types').LayoutServerLoad} */
export async function load({ locals, depends }) {

	depends('app:session');

	return {
		username: locals.session?.username,
		role: locals.session?.role
	};
}