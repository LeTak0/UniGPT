
import { error } from '@sveltejs/kit';
import { validateRole } from '$lib/server/sessionHelper';
import { sendMessageInChat } from '$lib/server/chat';
import { deleteChat } from '$lib/server/database';
import Joi from 'joi';
import { chatGptMessageShema, chatNameShema } from '$lib/server/validationTypes.js';

const messageChatSchema = Joi.object({
	chat: chatNameShema,
	message: chatGptMessageShema
});

export async function POST({ request , locals}) {

	//validate user session
	if (!await validateRole(locals, 'user')) return new Response(JSON.stringify({error:"You are not authorized to write in this chat"}),{status:403});
	
	let data = await request.json()


	let { error: err, value } = messageChatSchema.validate(data);
	if (err) error(400, err.message);


	try {
		let responseStream = await sendMessageInChat(locals.session.username,value.chat,value.message);

		return new Response(responseStream, {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		console.error(e);
		return error(500, "Unable to send message");
	}
}

const deleteChatSchema = Joi.object({
	chat: chatNameShema,
});

export async function DELETE({ request , locals}) {

	//validate user session
	if (!await validateRole(locals, 'user')) return new Response(JSON.stringify({error:"You are not authorized to delete a chat"}),{status:403});
	
	let data = await request.json();

	let { error: err, value } = deleteChatSchema.validate(data);
	if (err) error(400, err.message);

	let deleted = await deleteChat(locals.session.username,value.chat);

	if(!deleted) return new Response(JSON.stringify({error:"Chat not found"}),{status:404});

	return new Response(JSON.stringify({ success: true }));
}