import { loginUser } from "$lib/server/database";
import { validateRole } from "$lib/server/sessionHelper";
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({request, cookies}) => {
		let formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		if(!username || !password || typeof username !== 'string' || typeof password !== 'string'){
			return fail(400, {message: 'Invalid username or password'});
		}

		//not very clean, but sveltekit expects a throw to redirect
		let loggedIn = await loginUser(username,password)
		.then((sessionToken) => { 
			return {sucess:true,token:sessionToken.token,role:sessionToken.role}; 
		}).catch((err) => {
			console.error(err);
			return {sucess:false,token:"",role:""};
		});

		if(loggedIn.sucess){
			cookies.set('auth', loggedIn.token);
			switch(loggedIn.role){
				case "admin":
					throw redirect(307, '/admin');
				case "user":
				default:
					throw redirect(307, '/chat');
			}
		}else{
			return fail(401, {message: "Invalid username or password"});
		}
	},
}

export async function load({locals}) {
	let loggedIn = await validateRole(locals, 'user');
	if(loggedIn) throw redirect(307, '/chat');
	return {};
}