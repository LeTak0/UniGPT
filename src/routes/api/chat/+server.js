
import { error } from '@sveltejs/kit';
import fs from "fs";
import config from "$lib/server/config.js";
import OpenAI from 'openai';

const openai = new OpenAI({
	apiKey: config.openAiApiKey,
});

const chatDirectory = 'data/chat';
export async function POST({ request }) {
	let { message, chat } = await request.json();

	if (!message) {
		throw error(400, "Missing message");
	}

	if (!chat) {
		//throw error(400, "Missing chatname");
	}

	// Define the file path
	const filePath = `${chatDirectory}/${chat}.json`;

	// Initialize or read chat history
	/**
	 * @type {{ role: string; content: string; }[]}
	 */
	let history;
	if (fs.existsSync(filePath)) {
		history = JSON.parse(fs.readFileSync(filePath, 'utf8'));
	} else {
		history = [];
	}

	// Append new user message to history
	history.push({ role: "user", content: message });

	const stream = openai.beta.chat.completions.stream({
		messages: [
			{ role: "system", content: "You are a math tutor. Be kind to your students and help them learn math." },
			...history
		],
		model:config.openAiModelName,
	});

	// Save updated history to the file
	fs.writeFileSync(filePath, JSON.stringify(history));

	const responseStream = new ReadableStream({
		start(controller) {
			stream.on('content', (delta) => {
				let responseJSON = {message:delta,error:undefined};
				let responseString = JSON.stringify(responseJSON);
				let uInt8Array = new TextEncoder().encode(responseString);
				controller.enqueue(uInt8Array);
			});
			
			stream.finalMessage().then((completion) => {
				console.log("finalChatCompletion",completion);
				// Update history with AI response
				history.push({ role: "assistant", content: completion.content || ""});

				// Save updated history to the file
				fs.writeFileSync(filePath, JSON.stringify(history));
			});
		}
	});

	return new Response(responseStream, {
		headers: { 'Content-Type': 'application/json' }
	});
}