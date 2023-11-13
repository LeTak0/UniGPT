export async function POST({ request }) {
	let { message } = await request.json();

	console.log("User send message: " + message);

	return new Response(JSON.stringify({ success: true , message:"Welcome to my world user."}));
}