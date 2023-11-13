import bcrypt from 'bcrypt';
import fs from 'fs';
import { parse, stringify } from 'csv/sync';
import { error } from '@sveltejs/kit';

const usersCsvPath = 'data/users.csv';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	let { username, password } = await request.json();

    // Load existing users
    let users = [];
    if (fs.existsSync(usersCsvPath)) {
        const usersCsv = fs.readFileSync(usersCsvPath);
        users = parse(usersCsv, { columns: true });
    }

    // Check user password
	for (let i = 0; i < users.length; i++) {
		const user = users[i];
		if (user.username !== username) continue;
		const salt = user.salt;
		console.log(salt,password);
		const hashedPassword = await bcrypt.hash(password, salt);
		if (hashedPassword !== user.password) {
			throw error(401, 'Incorrect password');
		}
		// Respond with success
		return new Response(JSON.stringify({ success: true }));
	}

	throw error(404, 'User not found');
}


