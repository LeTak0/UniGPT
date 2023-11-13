const delay = (/** @type {number} */ ms) => new Promise(resolve => setTimeout(resolve, ms))

export async function POST({ request }) {
	let { message } = await request.json();

	console.log("User send message: " + message);

	await delay(2000)

	return new Response(JSON.stringify({ success: true , message:"Welcome to my world user."}));
}