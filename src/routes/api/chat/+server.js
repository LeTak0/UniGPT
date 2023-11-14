
import { error } from '@sveltejs/kit';
import fs from "fs";
import config from "$lib/server/config.js";

const chatDirectory = 'data/chat/';
export async function POST({ request }) {
	let { message, chat } = await request.json();

	if(!message) {
		throw error(400, "Missing message");
	}

	if(!chat) {
		//throw error(400, "Missing chatname");
	}

	// Define the file path
    const filePath = `${chatDirectory}/${chat}.json`;

    // Initialize or read chat history
    let history;
    if (fs.existsSync(filePath)) {
        history = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } else {
        history = [];
    }

	// Append new user message to history
    history.push({ role: "user", content: message });

	let requestBody = {
		model: config.openAiModelName,
		messages:[
			{role:"system",content:"You are a math tutor. Be kind to your students and help them learn math."},
			...history
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

	// Update history with AI response
    history.push({ role: "assistant", content: completionText });

    // Save updated history to the file
    fs.writeFileSync(filePath, JSON.stringify(history));

	return new Response(JSON.stringify({ success: true , message: completionText}));
}