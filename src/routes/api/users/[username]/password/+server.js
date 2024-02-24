import { updatePassword } from "$lib/server/database.js";
import { validateRole } from "$lib/server/sessionHelper";
import { passwordShema, usernameShema } from "$lib/server/validationTypes.js";
import { text } from "@sveltejs/kit";
import Joi from "joi";

const userUpdateSchema = Joi.object({
	username: usernameShema,
	password: passwordShema
});

export async function PUT({ locals, request, params }) {
	if (!await validateRole(locals, 'admin')) return text("You are not authorized to change the password of this user", { status: 403 });

	const data = await request.json();
	data.username = params.username;

	let { error: err, value } = userUpdateSchema.validate(data);
	if (err) return text(err.message, { status: 400 });

	let success = await updatePassword(value.username,value.password);

	if(!success) return text("User not found", { status: 404 });

	return text('success');
}