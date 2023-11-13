<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let username = '';
	let password = '';

	async function login() {
		const response = await fetch('/api/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password })
		});

		if (response.ok) {
			// Redirect to the user dashboard or home page after successful login
			goto('https://chat.openai.com');
		} else {
			// Handle errors, e.g., show an error message
			console.error('Login failed');
		}
	}
</script>

<div class="p-4 bg-light rounded border">
	<h1 class="mb-4">Login</h1>
	<form on:submit|preventDefault={login}>
		<div class="mb-3">
			<label for="username form-label">Username:</label>
			<input id="username form-control" type="text" bind:value={username} required />
		</div>
		<div class="mb-3">
			<label for="password form-label">Password:</label>
			<input id="password form-control" type="password" bind:value={password} required />
		</div>

		<input class="btn btn-primary" type="submit" value="Login" />
	</form>
</div>
