import fs from 'fs';
import { parse, stringify } from 'csv/sync';
import { json } from '@sveltejs/kit'; // Import the json helper

const usersCsvPath = 'data/users.csv'; // Ensure this path is correct

export async function GET(request) {
    // ... authentication and authorization checks, important that only the Admin has access to this route
    //     also maybe add admin bool to the user object and csv file ...

    let users = [];
    if (fs.existsSync(usersCsvPath)) {
        const usersCsv = fs.readFileSync(usersCsvPath);
        users = parse(usersCsv, { columns: true });
    }

    const usersWithoutPasswords = users.map(({ password, ...user }) => user);

    // Using json helper to return a Response object
    return json({ users: usersWithoutPasswords });
}

export async function POST(request) {
    // ... authentication and authorization checks, important that only the Admin has access to this route
    // also maybe add admin bool to the user object and csv file ...

    let users = [];
    if (fs.existsSync(usersCsvPath)) {
        const usersCsv = fs.readFileSync(usersCsvPath);
        users = parse(usersCsv, { columns: true });
    }

    // Add new user
    users.push(await request.json());
    const updatedCsv = stringify(users, { header: true });
    fs.writeFileSync(usersCsvPath, updatedCsv);

    // Using json helper to return a Response object
    return json({ success: true });
}
