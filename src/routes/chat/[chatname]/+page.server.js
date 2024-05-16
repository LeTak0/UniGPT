import { getChatHistory, renameChat } from '$lib/server/database';
import { validateRole } from '$lib/server/sessionHelper';
import { fail, redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import { chatNameShema, usernameShema } from '$lib/server/validationTypes';
import Joi from 'joi';


const chatLoadShema = Joi.object({
	username: usernameShema,
	chatname: chatNameShema
});


/** @type {import('./$types').PageServerLoad } 
 *  @returns Promise<{ history: ChatHistoryMessages, chatname : string }>
*/
export async function load({ params, locals }) {
	if (!await validateRole(locals, 'user')) return fail(403, {message:'You are not authorized to load this chat'});

	let { error: err, value } = chatLoadShema.validate({chatname:params.chatname,username:locals.session.username});
	if (err) return fail(400, {message:err.message});

	let chatHistory = await getChatHistory(value.username,value.chatname);

	return {
		history:chatHistory,
		chatname:params.chatname
	};
}

const chatRenameShema = Joi.object({
	username: usernameShema,
	chatname: chatNameShema,
	newName: chatNameShema
});

export const actions = {
	rename: async ({locals,params,request}) => {
		if (!await validateRole(locals, 'user')) return fail(403, {message:'You are not authorized to rename this chat'});
		
		const formData = await request.formData();

		const {chatname} = params;
		const newName = formData.get('name');
		
		let { error: err, value } = chatRenameShema.validate({chatname,newName,username:locals.session.username});
		if (err) return fail(400, {message:err.message});

		await renameChat(value.username,value.chatname,value.newName);

		redirect(307,`${base}/chat/${newName}`);
	}
};