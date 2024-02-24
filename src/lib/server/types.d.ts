
interface SessionInfo {
	username: string;
	role: string;
	token: string;
}

declare namespace App {
    interface Locals {
        session: SessionInfo;
    }

    interface PageData {}

    interface Platform {}
}

type MessageContent = string | ({type:"text",text:string} | {type:"image_url",image_url:{url:string}})[];


//MathJax
declare var MathJax: any;