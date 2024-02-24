
import config from "$lib/server/config.js";
import OpenAI from 'openai';
import { getChatHistory, updateChatHistory } from "./database";

if(!config.openAiApiKey) throw new Error("OPENAI_API_KEY environment variable not set");
if(!config.openAiModelName) throw new Error("OPENAI_MODEL_NAME environment variable not set");

const openai = new OpenAI({
	apiKey: config.openAiApiKey,
});

/**
 * @param {string} username 
 * @param {string} chatname 
 * @param {string} message 
 * @returns {Promise<ReadableStream<Uint8Array>>}
 */
export async function sendMessageInChat(username,chatname,message){
	let history = await getChatHistory(username,chatname);

	// Append new user message to history
	history.push({ role: "user", content: [
		{ type: "text", text: message }
	], name: username });

	updateChatHistory(username,chatname,history);

	const stream = openai.beta.chat.completions.stream({
		messages: [
			{ role: "system", content: "You are a math tutor. Be kind to your students and help them learn and better understand math. You must use Tex notation for Formulas. To write equations inline use \\(\\)."},
			...history
		],
		model:config.openAiModelName,
	});

	const responseStream = new ReadableStream({
		start(controller) {
			stream.on('content', (delta) => {
				let uInt8Array = new TextEncoder().encode(delta);
				controller.enqueue(uInt8Array);
			});
			
			stream.finalMessage().then((completion) => {
				// Update history with AI response
				history.push({ role: "assistant", content: completion.content || "", name: "AI"});

				updateChatHistory(username,chatname,history);

				controller.close();
			});
		}
	});

	return responseStream;
}