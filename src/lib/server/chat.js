
import config from "$lib/server/config.js";
import OpenAI from 'openai';
import { getChatHistory, updateChatHistory } from "./database";
import { configSystemPrompt, configTools } from "./paths";
import fs from 'fs';

//system prompt
if (!fs.existsSync(configSystemPrompt)) throw new Error("System prompt file not found at " + configSystemPrompt);
let system_prompt = fs.readFileSync(configSystemPrompt, 'utf8');

//system tools
if (!fs.existsSync(configTools)) throw new Error("Tools file not found at " + configTools);
let tools = JSON.parse(fs.readFileSync(configTools, 'utf8'));

//api
if (!config.openAiApiKey) throw new Error("OPENAI_API_KEY environment variable not set");
if (!config.openAiModelName) throw new Error("OPENAI_MODEL_NAME environment variable not set");

const openai = new OpenAI({
	apiKey: config.openAiApiKey,
});

/**
 * @param {string} username 
 * @param {string} chatname 
 * @param {string} message 
 * @returns {Promise<ReadableStream<Uint8Array>>}
 */
export async function sendMessageInChat(username, chatname, message) {
	let history = await getChatHistory(username, chatname);

	// Append new user message to history
	history.push({
		role: "user", 
		name: username,
		content: [{ type: "text", text: message }]
	});

	updateChatHistory(username, chatname, history);

	const stream = openai.beta.chat.completions.stream({
		messages: [
			{ role: "system", content: system_prompt },
			...history
		],
		model: config.openAiModelName,
		tools: tools,
		tool_choice: "auto"
	});

	const responseStream = new ReadableStream({
		start(controller) {
			stream.on('content', (delta) => {
				let uInt8Array = new TextEncoder().encode(delta);
				controller.enqueue(uInt8Array);
			});

			stream.finalMessage().then((completion) => {

				history.push({ role: "assistant", content: completion.content || "", tool_calls: completion.tool_calls, name: "AI" });

				if(completion.tool_calls) {
					for (let toolCall of completion.tool_calls) {
						history.push({ role: "tool", content: toolCall.function.arguments, tool_call_id: toolCall.id, name: "Geogebra"});
					}
				}

				// Update history with AI response
				updateChatHistory(username, chatname, history);

				controller.close();
			});
		}
	});

	return responseStream;
}