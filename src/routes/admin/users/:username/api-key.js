// src/routes/admin/users/[username]/api-key.js

import fs from 'fs';
import { parse, stringify } from 'csv/sync';

const usersCsvPath = 'data/users.csv'; // Ensure this path is correct

export async function post(request) {
    // Authentication and authorization checks should go here
    // ...

    const { username } = request.params;
    const { newApiKey } = request.body;

    // Load existing users
    let users = [];
    if (fs.existsSync(usersCsvPath)) {
        const usersCsv = fs.readFileSync(usersCsvPath);
        users = parse(usersCsv, { columns: true });
    }

    // Find and update the user's API key
    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex === -1) {
        return { status: 404, body: { error: 'User not found' } };
    }

    users[userIndex].apiKey = newApiKey;

    // Save the updated users back to the CSV
    const updatedCsv = stringify(users, { header: true });
    fs.writeFileSync(usersCsvPath, updatedCsv);

    return { status: 200, body: { success: 'API key updated' } };
}
