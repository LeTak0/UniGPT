import bcrypt from 'bcrypt';
import fs from 'fs';
import { parse, stringify } from 'csv/sync';

console.log('Register endpoint loaded');

const usersCsvPath = 'data/users.csv';

export async function post(request) {
    const { username, password } = request.body;

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
        return { status: 409, body: { error: 'User already exists' } };
    }

    // Add new user
    users.push({ username, password: hashedPassword });
    const updatedCsv = stringify(users, { header: true });
    fs.writeFileSync(usersCsvPath, updatedCsv);

    // Respond with success
    return { status: 200, body: { success: 'User registered' } };
}
