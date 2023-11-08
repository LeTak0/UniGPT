import bcrypt from 'bcrypt';
import fs from 'fs';
import { parse } from 'csv/sync';
import { serialize } from 'cookie';
import jwt from 'jsonwebtoken';

const usersCsvPath = 'data/users.csv';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Set this in your environment

export async function post(request) {
    const { username, password } = request.body;

    // Load users
    let users = [];
    if (fs.existsSync(usersCsvPath)) {
        const usersCsv = fs.readFileSync(usersCsvPath);
        users = parse(usersCsv, { columns: true });
    }

    // Find user
    const user = users.find(user => user.username === username);
    if (!user) {
        return { status: 401, body: { error: 'Invalid credentials' } };
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        return { status: 401, body: { error: 'Invalid credentials' } };
    }

    // Create a JWT token
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '24h' });

    // Set a cookie header with the JWT token
    const headers = {
        'Set-Cookie': serialize('session', token, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            // secure: true, // Uncomment this when using HTTPS
            maxAge: 60 * 60 * 24 // 24 hours
        })
    };

    // Respond with success
    return { status: 200, headers, body: { success: 'Logged in' } };
}
