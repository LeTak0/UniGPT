import { loginUser } from "$lib/server/database";
import { validateRole } from "$lib/server/sessionHelper";
import { fail, redirect } from '@sveltejs/kit';
import { passwordShema, usernameShema } from '$lib/server/validationTypes';
import Joi from 'joi';

const loginShema = Joi.object({
	username: usernameShema,
	password: passwordShema
});

export const actions = {
	default: async ({request, cookies}) => {
		let formData = await request.formData();
		const username = formData.get('username');
		const password = formData.get('password');

		let { error: err, value } = loginShema.validate({username,password});
		if (err) return fail(400, {message:err.message});

		//not very clean, but sveltekit expects a throw to redirect
		let loggedIn = await loginUser(value.username,value.password)
		.then((sessionToken) => { 
			return {sucess:true,token:sessionToken.token,role:sessionToken.role}; 
		}).catch((err) => {
			console.error(err);
			return {sucess:false,token:"",role:""};
		});

		if(loggedIn.sucess){
			/* @migration task: add path argument */ cookies.set('auth', loggedIn.token,{path: '/'});
			switch(loggedIn.role){
				case "admin":
					redirect(307, '/admin');
					break;
				case "user":
				default:
					redirect(307, '/chat');
					break;
			}
		}else{
			return fail(401, {message: "error.login.invalid"});
		}
	},
}

export async function load({locals}) {
	let loggedIn = await validateRole(locals, 'user');
	if(loggedIn) redirect(307, '/chat');
	return {};
}