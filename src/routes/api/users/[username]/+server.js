import { deleteUsers, getUser, updateUser } from '$lib/server/database';
import { validateRole } from '$lib/server/sessionHelper';
import { roleShema, usernameShema } from '$lib/server/validationTypes';
import { json , text } from '@sveltejs/kit';
import Joi from 'joi';



const userGetSchema = Joi.object({
	username: usernameShema
});

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, locals }) {
	if (!await validateRole(locals, 'admin')) return text("You are not authorized to view this user", { status: 403 });

	let { error: err, value } = userGetSchema.validate({username:params.username});
	if (err) return text(err.message, { status: 400 });

	let user = await getUser(value.username)
	if(!user) return new Response("User not found", { status: 404 });

	return json(user);
}

const userUpdateSchema = Joi.object({
	username: usernameShema,
	newUsername: usernameShema,
	newRole: roleShema
});

export async function PATCH({ locals, request }) {
	if (!await validateRole(locals, 'admin')) return text("You are not authorized to update this user", { status: 403 });

	const formData = await request.formData();

	const username = formData.get('username');
	const newUsername = formData.get('newUsername');
	const newRole = formData.get('role');
	
	let { error: err, value } = userUpdateSchema.validate({username,newUsername,newRole});
	if (err) return text(err.message, { status: 400 });

	await updateUser(value.username,value.newUsername,value.newRole);

	return text('success');
}

const userDeleteSchema = Joi.object({
	username: usernameShema
});

export async function DELETE({ params, locals }) {
	if (!await validateRole(locals, 'admin')) return text("You are not authorized to delete this user", { status: 403 });

	let { error: err, value } = userDeleteSchema.validate({username:params.username});
	if (err) return text(err.message, { status: 400 });

	await deleteUsers([value.username]);

	return new Response(JSON.stringify({ success: true }));
}