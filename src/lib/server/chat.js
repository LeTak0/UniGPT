
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
 * @param {import("openai/resources/index.mjs").ChatCompletionMessageParam[]} history
 * @param {any} tool_calls
 * @returns {import("openai/resources/index.mjs").ChatCompletionMessageParam[]} history 
 */
function process_tool_calls(history, tool_calls) {
	for (let toolCall of tool_calls) {
		history.push({ role: "tool", content: toolCall.function.arguments, tool_call_id: toolCall.id });
	}
	return history;
}

/**
 * @param {string} username 
 * @param {string} chatname 
 * @param {string} message 
 * @returns {Promise<ReadableStream<Uint8Array>>}
 */
export async function sendMessageInChat(username, chatname, message) {
	let history = await getChatHistory(username, chatname) || [];

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
		model: /**@type {OpenAI.Chat.ChatModel} */ (config.openAiModelName) || "gpt-3.5-turbo",
		tools: tools,
		tool_choice: "auto",
		stream: true
	});

	return new ReadableStream({
		start(controller) {
			stream.on('error', (error) => {
				console.error(error);
				controller.error(error);
			});

			stream.on('content', (content) => {
				let uInt8Array = new TextEncoder().encode(content);
				controller.enqueue(uInt8Array);
			});

			stream.on('finalChatCompletion', (completion) => {

				let message = completion.choices[0].message;

				history.push({ role: "assistant", content: message.content || "", tool_calls: message.tool_calls, name: "AI" });
				history = process_tool_calls(history, message.tool_calls || []);

				updateChatHistory(username, chatname, history);

				controller.close();
			});
		}
	});
}