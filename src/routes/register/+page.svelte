<script>
	import { goto } from '$app/navigation';
	let username = '';
	let password = '';
	let showError = false;

	async function register(event) {
		// Prevent the default form submission
		event.preventDefault();
		console.log('Register function called'); // Debugging line

		try {
			const response = await fetch('/api/register', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, password })
			});

			const result = await response.json();
			console.log('Response received:', result); // Debugging line

			if (response.ok) {
				// Registration was successful, redirect to the login page
				goto('/login');
			} else {
				// Handle errors, show message to the user
				console.error('Registration error:', result.error);
				showError = true;
				// Display error message to the user
			}
		} catch (error) {
			console.error('Network or other error:', error);
			// Handle network errors or other exceptions
		}
	}
</script>

<div class="p-4 bg-light rounded border">
	<h1 class="mb-4">Register</h1>
	<form on:submit|preventDefault={register}>
		<div class="mb-3">
			<label for="username form-label">Username:</label>
			<input id="username form-control" type="text" bind:value={username} required />
		</div>
		<div class="mb-3">
			<label for="password form-label">Password:</label>
			<input id="password form-control" type="password" bind:value={password} required />
		</div>

		<input class="btn btn-primary" type="submit" value="Register" />
		{#if showError}
  		<div class="alert alert-danger" role="alert">
    		User already exists
  		</div>
		{/if}
	</form>
</div>


