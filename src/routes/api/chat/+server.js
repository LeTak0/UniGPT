
import { error } from '@sveltejs/kit';
import { validateRole } from '$lib/server/sessionHelper';
import { sendMessageInChat } from '$lib/server/chat';

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