import { updateUser } from '$lib/server/database';
import { validateRole } from '$lib/server/sessionHelper';
import { text } from '@sveltejs/kit';

export async function PUT({ params, locals, request }) {
	if (!await validateRole(locals, 'admin')) return text("You are not authorized to update this user", { status: 403 });

	const formData = await request.formData();

	const {username} = params;
	const newName = formData.get('newUsername');
	const newRole = formData.get('newRole');

	if(
		!newName || 
		typeof newName !== 'string' || 
		(newRole !== 'user' && newRole !== 'admin') ||
		newName.length < 1
	) return text("Invalid username or role", { status: 400 });

	await updateUser(username,newName,newRole);

	return new Response(JSON.stringify({ success: true }));
}
