import dotenv from "dotenv";
dotenv.config();

export default {
	//loading environment variables from .env file (or from the environment if it's already set)
	openAiApiKey: process.env.OPENAI_API_KEY,
	openAiModelName: process.env.OPENAI_MODEL_NAME,
}