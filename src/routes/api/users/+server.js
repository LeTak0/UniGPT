import { createUser, deleteUsers } from "$lib/server/database";
import { validateRole } from "$lib/server/sessionHelper";
import { passwordShema, roleShema, usernameShema } from "$lib/server/validationTypes";
import { json, text } from "@sveltejs/kit";
import Joi from "joi";

const userCreateSchema = Joi.object({
	username: usernameShema,
	password: passwordShema,
	role: roleShema
});

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals }) {
	if (!await validateRole(locals, 'admin')) return text("You are not authorized to view this user", { status: 403 });

	let data = await request.json();

	let { error: err, value } = userCreateSchema.validate(data);
	if (err) return text(err.message, { status: 400 });

	let user = await createUser(value.username,value.password,value.role);
	if(!user) return new Response("Could not create user", { status: 500 });

	return json(user);
}

const bulkUserDeleteSchema = Joi.object({
	users: Joi.array().items(usernameShema)
});

export async function DELETE({ request, locals }) {
	if (!await validateRole(locals, 'admin')) return text("You are not authorized these users", { status: 403 });

	let data = await request.json();

	let { error: err, value } = bulkUserDeleteSchema.validate(data);
	if (err) return text(err.message, { status: 400 });

	await deleteUsers(value.users);

	return new Response(JSON.stringify({ success: true }));
}
