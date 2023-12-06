import { getChatHistory, renameChat } from '$lib/server/database';
import { validateRole } from '$lib/server/sessionHelper';
import { fail, redirect } from '@sveltejs/kit';
import { base } from '$app/paths';


/** @type {import('./$types').PageServerLoad } */
export async function load({ params, locals }) {
	if (!await validateRole(locals, 'user')) return fail(403, {message:'You are not authorized to load this chat'});

	let chatHistory = await getChatHistory(locals.session.username,params.chatname);

	return {
		history:chatHistory,
		chatname:params.chatname
	};
}

export const actions = {
	rename: async ({locals,params,request}) => {
		if (!await validateRole(locals, 'user')) return fail(403, {message:'You are not authorized to rename this chat'});
		
		const formData = await request.formData();

		const {chatname} = params;
		const newName = formData.get('name');

		if(!newName || typeof newName !== 'string' || newName.length < 1) return fail(400, {message:'Invalid chat name'});

		await renameChat(locals.session.username,chatname,newName);

		throw redirect(307,`${base}/chat/${newName}`);
	}
};