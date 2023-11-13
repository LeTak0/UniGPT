
import { error } from '@sveltejs/kit';

import config from "$lib/server/config.js";

export async function POST({ request }) {
	let { message } = await request.json();

	console.log("User send message: " + message);

	let requestBody = {
		model: config.openAiModelName,
		messages:[
			{role:"system",content:"You are a math tutor. Be kind to your students and help them learn math."},
			{role:"user",content:message}
		]
	}

	let completionRequest = await fetch("https://api.openai.com/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${config.openAiApiKey}`
		},
		body: JSON.stringify(requestBody)
	}).catch(err => {
		console.log("Error: " + err);
		throw error(500, "Error connecting to OpenAI API");
	});

	let completionResponse = await completionRequest.json();

	if("error" in completionResponse) {
		throw error(500, "Error from OpenAI API: " + completionResponse.error.message);
	}

	let completionText = completionResponse.choices[0].message.content;

	console.log("AI response: " + completionText);

	return new Response(JSON.stringify({ success: true , message: completionText}));
}