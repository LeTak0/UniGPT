import { checkSession } from '$lib/server/database';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	
	//get cookie
	let auth = event.cookies.get('auth');
	if(!auth) return await resolve(event);

	//validate session
	let sessionValid = await checkSession(auth)
	.then((/** @type {any} */ session) => {
		return {valid:true,session};
	})
	.catch((/** @type {any} */ err) => {
		return {valid:false,session:null,err};
	});

	if(!sessionValid.valid) return await resolve(event);

	//add session to locals
	event.locals.session = sessionValid.session;

	return await resolve(event);
}