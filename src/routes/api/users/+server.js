import fs from 'fs';
import { parse } from 'csv/sync';

const usersCsvPath = 'data/users.csv'; // Ensure this path is correct

export async function get(request) {
    // Authentication and authorization checks should go here
    // ...

    // Load existing users
    let users = [];
    if (fs.existsSync(usersCsvPath)) {
        const usersCsv = fs.readFileSync(usersCsvPath);
        users = parse(usersCsv, { columns: true });
    }

    // Return the list of users without passwords
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    return { status: 200, body: { users: usersWithoutPasswords } };
}