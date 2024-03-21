
interface SessionInfo {
	username: string;
	role: string;
	token: string;
}



interface GeogebraDocExpression {
	value: string,
	label: string
}

interface GeogebraDocArguments {
	expressions: GeogebraDocExpression[]
}



type MessageContent = string | ({type:"text",text:string} | {type:"image_url",image_url:{url:string}})[];

interface ToolCall {
	id: string,
	type: "function",
	function: {
		name: string,
		arguments: string
	}
}

interface ChatHistoryMessage {
	role: "assistant" | "user" | "tool",
	name:string,
	content: MessageContent | null,
	tool_calls?: ToolCall[],
	tool_call_id? : string
	data?: string
}
type ChatHistory = ChatHistoryMessage[];





declare namespace App {
    interface Locals {
        session: SessionInfo;
    }

    interface PageData {}

    interface Platform {}
}

//MathJax
declare var MathJax: any;