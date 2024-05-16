import { createChat, getChats } from '$lib/server/database';
import { validateRole } from '$lib/server/sessionHelper';
import { fail, redirect } from '@sveltejs/kit';
import { base } from '$app/paths';

export const actions = {
	default: async (event) => {
		if (!await validateRole(event.locals, 'user')) return fail(403, {message:'You are not authorized to create a chat'});
		
		const chats = await getChats(event.locals.session.username);
		const chatCount = chats.length+1;

		const chatname = `chat ${chatCount}`;

		await createChat(event.locals.session.username,chatname);

		redirect(307,`${base}/chat/${chatname}`);
	}
};