
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

//MathJax
declare var MathJax: any;