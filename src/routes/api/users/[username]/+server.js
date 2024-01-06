import { deleteUsers, getUser, updateUser } from '$lib/server/database';
import { validateRole } from '$lib/server/sessionHelper';
import { json , text } from '@sveltejs/kit';


/** @type {import('./$types').RequestHandler} */
export async function GET({ params, locals }) {
	if (!await validateRole(locals, 'admin')) return text("You are not authorized to view this user", { status: 403 });

	let user = await getUser(params.username)
	if(!user) return new Response("User not found", { status: 404 });

	return json(user);
}

export async function PATCH({ params, locals, request }) {
	if (!await validateRole(locals, 'admin')) return text("You are not authorized to update this user", { status: 403 });

	const formData = await request.formData();

	const {username} = params;
	const newName = formData.get('username');
	const newRole = formData.get('role');

	console.log(username,newName,newRole);

	if(
		!newName || 
		typeof newName !== 'string' || 
		(newRole !== 'user' && newRole !== 'admin') ||
		newName.length < 1
	) return text("Invalid username or role", { status: 400 });

	await updateUser(username,newName,newRole);

	return new Response(JSON.stringify({ success: true }));
}

export async function DELETE({ params, locals }) {
	if (!await validateRole(locals, 'admin')) return text("You are not authorized to delete this user", { status: 403 });

	const {username} = params;

	await deleteUsers([username]);

	return new Response(JSON.stringify({ success: true }));
}