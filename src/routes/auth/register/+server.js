import bcrypt from 'bcrypt';
import fs from 'fs';
import { parse, stringify } from 'csv/sync';


const usersCsvPath = 'data/users.csv';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	let { username, password } = await request.json();

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Load existing users
    let users = [];
    if (fs.existsSync(usersCsvPath)) {
        const usersCsv = fs.readFileSync(usersCsvPath);
        users = parse(usersCsv, { columns: true });
    }

    // Check if user already exists
    if (users.some(user => user.username === username)) {
		throw error(409, 'User already exists')
    }

    // Add new user
    users.push({ username, password: hashedPassword });
    const updatedCsv = stringify(users, { header: true });
    fs.writeFileSync(usersCsvPath, updatedCsv);

    // Respond with success
    return new Response(JSON.stringify({ success: true }));
}


