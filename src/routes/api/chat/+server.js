
import { error } from '@sveltejs/kit';
import { validateRole } from '$lib/server/sessionHelper';
import { sendMessageInChat } from '$lib/server/chat';
import { deleteChat } from '$lib/server/database';

export async function POST({ request , locals}) {

	//validate user session
	if (!await validateRole(locals, 'user')) return new Response(JSON.stringify({error:"You are not authorized to create a chat"}),{status:403});

	let { message, chat } = await request.json();

	if (!message) {
		throw error(400, "Missing message");
	}

	if (!chat) {
		throw error(400, "Missing chatname");
	}

	let responseStream = await sendMessageInChat(locals.session.username,chat,message);

	return new Response(responseStream, {
		headers: { 'Content-Type': 'application/json' }
	});
}

export async function DELETE({ request , locals}) {

	//validate user session
	if (!await validateRole(locals, 'user')) return new Response(JSON.stringify({error:"You are not authorized to delete a chat"}),{status:403});

	let { chat } = await request.json();

	if (!chat) {
		throw error(400, "Missing chatname");
	}

	let deleted = await deleteChat(locals.session.username,chat);

	if(!deleted) return new Response(JSON.stringify({error:"Chat not found"}),{status:404});

	return new Response(JSON.stringify({ success: true }));
}