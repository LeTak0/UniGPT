import bcrypt from 'bcrypt';
import csvdb from 'csv-database';
import { usersCsvPath, sessionsCsvPath, chatsFolderPath } from "./paths";
import path from 'path';
import fs from 'fs';

/** @type {{ get: any; add: any; edit: (filter: Object, data: Object) => Promise<Object[]>; delete: (predicate: Object) => Promise<Object[]>; }} */
const userDB = await csvdb(usersCsvPath, ["username", "password", "salt", "role"]).catch((err) => {
	console.error(err);
	process.exit(1);
});

/** @type {{ get: any; add: any; edit: (filter: Object, data: Object) => Promise<Object[]>; delete: (predicate: Object) => Promise<Object[]>; }} */
const sessionDB = await csvdb(sessionsCsvPath, ["username", "sessionToken", "role"]).catch((err) => {
	console.error(err);
	process.exit(1);
});

if (!fs.existsSync(chatsFolderPath)) {
	fs.mkdirSync(chatsFolderPath);
}

/**
 * 
 * @param {string} username 
 * @returns {Promise<{username:string,password:string,salt:string,role:string} | null>}
 */
async function getUserFull(username) {
	let user = await userDB.get({ username: username });
	if (user.length === 0) return null;
	return user[0];
}

/**
 * 
 * @param {string} username 
 * @returns {Promise<{username:string,role:string} | null>}
 */
export async function getUser(username) {
	let user = await userDB.get({ username: username });
	if (user.length === 0) return null;
	return {
		username: user[0].username,
		role: user[0].role
	}
}

/**
 * 
 * @returns {Promise<{username:string,password:string,salt:string,role:string}[] | null>}
 */
export async function getUsers() {
	let users = await userDB.get({});
	return users.map((/** @type {{ username: any; role: any; }} */ user) => {
		return {
			username: user.username,
			role: user.role
		}
	});
}

/**
 * @param {string} username
 * @param {string} passwordHash
 * @param {string} salt
 * @param {string} role
 * @returns {Promise<boolean>}
 */
async function addUser(username, passwordHash, salt, role) {
	let user = {
		username,
		password: passwordHash,
		salt,
		role
	}

	await userDB.add(user).catch((/** @type {any} */ err) => {
		console.error(err);
		return Promise.reject();
	});

	return true;
}

/**
 * @param {string} oldUsername
 * @param {string} newUsername
 * @param {string} role
 * @returns {Promise<void>}
 */
export async function updateUser(oldUsername, newUsername, role) {
	let edited = await userDB.edit({ username: oldUsername }, { username: newUsername, role: role });
	if (edited.length === 0) return Promise.reject();
	return;
}


/**
 * @param {string[]} username
 * @returns {Promise<boolean>}
 */

export async function deleteUsers(username) {
	let deleted = [];
	for (let i = 0; i < username.length; i++) {
		deleted.push(await userDB.delete({ username: username[i] }));
	}
	if (deleted.length === 0) return Promise.reject();
	return true;
}


/**
 * @returns {string} sessionToken
 */
function generateSessionToken() {
	return crypto.randomUUID();
}

/**
 * @param {string} username
 * @param {string} role
 * @return {Promise<string>} sessionToken
 */
async function createSession(username, role) {
	//generate session token
	let sessionToken = generateSessionToken();

	let session = {
		username,
		sessionToken,
		role
	}

	//add session to database
	await sessionDB.add(session).catch((/** @type {any} */ err) => {
		console.error(err);
		return Promise.reject();
	});

	return sessionToken;
}

/**
 * @param {string} sessionToken
 * @returns {Promise<{username:string,role:string,token:string}>}
 */
export async function checkSession(sessionToken) {
	const session = await sessionDB.get({ sessionToken: sessionToken });
	if (session.length === 0) throw new Error('Invalid session token');
	return {
		username: session[0].username,
		role: session[0].role,
		token: session[0].sessionToken
	}
}

/**
 * @param {string} sessionToken
 */
export async function deleteSession(sessionToken) {
	await sessionDB.delete({ sessionToken: sessionToken });
	return true;
}

/**
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{token:string,role:string}>} sessionToken
 */
export async function loginUser(username, password) {

	//check if user exists
	let user = await getUserFull(username);
	if (!user) return Promise.reject();

	//check if password is correct
	const salt = user.salt;
	const hashedPassword = await bcrypt.hash(password, salt);
	if (hashedPassword !== user.password) return Promise.reject();

	//create session
	let sessionToken = await createSession(username, user.role);

	return { token: sessionToken, role: user.role };
}

/**
 * @param {string} username
 * @param {string} password
 * @returns {Promise<boolean>} success
 */
export async function createUser(username, password, role = 'user') {
	let user = await getUserFull(username);
	if (user) return Promise.reject(new Error('User already exists'));

	// Hash the password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	await addUser(username, hashedPassword, salt, role);

	return true;
}

/**
 * @param {string} username
 * @param {string} password
 * @returns {Promise<boolean>} success
 */
export async function updatePassword(username, password) {
	let user = await getUserFull(username);
	if (!user) return false;

	// Hash the password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	let affected = await userDB.edit({ username: username }, { password: hashedPassword, salt: salt });

	if (affected.length === 0) return Promise.reject();

	return true;
}

/**
 * @param {string} username
 * @param {string} chatName
 */
export async function createChat(username, chatName) {

	//make sure user has a chat folder
	let userChatsPath = path.join(chatsFolderPath, username);
	if (!fs.existsSync(userChatsPath)) {
		fs.mkdirSync(userChatsPath);
	}

	//create new chat file
	let newChatFilePath = path.join(userChatsPath, chatName + '.json');
	fs.writeFileSync(newChatFilePath, JSON.stringify([]));

	return true;
}

/**
 * @param {string} username
 * @param {string} chatName
 * @returns {Promise<boolean>} success
 */
export async function deleteChat(username, chatName) {
	return new Promise((resolve, reject) => {
		//make sure user has a chat folder
		let userChatsPath = path.join(chatsFolderPath, username);
		if (!fs.existsSync(userChatsPath)) {
			fs.mkdirSync(userChatsPath);
		}

		//create new chat file
		let chatFilePath = path.join(userChatsPath, chatName + '.json');
		fs.unlink(chatFilePath, (err) => {
			if (err) reject(err);
			resolve(true);
		});
	});
}

/**
 * @param {string} username
 * @returns {Promise<{name:string}[]>} chats
 */
export async function getChats(username) {
	let userChatsPath = path.join(chatsFolderPath, username);
	if (!fs.existsSync(userChatsPath)) {
		fs.mkdirSync(userChatsPath);
	}

	let chats = fs.readdirSync(userChatsPath);
	let cleanChats = chats.map((chatName) => {
		return {
			name: chatName.replace('.json', '')
		}
	});

	return cleanChats;
}

/**
 * @param {string} username
 * @param {string} chatName
 * @returns {Promise<import('openai/resources/index.mjs').ChatCompletionMessageParam[]>} chatHistory
 */
export async function getChatHistory(username, chatName) {
	let userChatsPath = path.join(chatsFolderPath, username);
	let chatFilePath = path.join(userChatsPath, chatName + '.json');

	if (!fs.existsSync(chatFilePath)) return [];

	let chatHistory = JSON.parse(fs.readFileSync(chatFilePath, 'utf8'));

	return chatHistory;
}

/**
 * 
 * @param {string} username 
 * @param {string} chatName 
 * @param {import("openai/resources/index.mjs").ChatCompletionMessageParam[]} history 
 */
export async function updateChatHistory(username, chatName, history) {
	let userChatsPath = path.join(chatsFolderPath, username);
	if (!fs.existsSync(userChatsPath)) {
		fs.mkdirSync(userChatsPath);
	}

	let chatFilePath = path.join(userChatsPath, chatName + '.json');
	if (!fs.existsSync(chatFilePath)) {
		fs.writeFileSync(chatFilePath, JSON.stringify([]));
	}

	fs.writeFileSync(chatFilePath, JSON.stringify(history));
}

/**
 * @param {string} username
 * @param {string} oldChatName
 * @param {string} newChatName
 */
export async function renameChat(username, oldChatName, newChatName) {
	let userChatsPath = path.join(chatsFolderPath, username);
	let oldChatFilePath = path.join(userChatsPath, oldChatName + '.json');
	let newChatFilePath = path.join(userChatsPath, newChatName + '.json');

	if (!fs.existsSync(oldChatFilePath)) return false;

	fs.renameSync(oldChatFilePath, newChatFilePath);

	return true;
}