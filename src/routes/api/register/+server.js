import { error, text } from '@sveltejs/kit';
import { createUser } from '$lib/server/database';
import Joi from 'joi';
import { passwordShema, usernameShema } from '$lib/server/validationTypes';


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	let data = await request.json();
	
	let { error: err, value } = Joi.object({
		username: usernameShema,
		password: passwordShema
	}).validate(data);
	if (err) throw error(400, err.message);

	await createUser(value.username, value.password).catch((err) => {
		throw error(401, err.message);
	});

    return text('success');
}


