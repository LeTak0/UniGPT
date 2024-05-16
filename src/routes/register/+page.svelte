<script>
	import { t } from '$lib/translations'
	;
	import { goto } from '$app/navigation';
	let username = '';
	let password = '';
	/**
	 * @type {string | null}
	 */
	let error = null;

	/**
	 * @param {{ preventDefault: () => void; }} event
	 */
	async function register(event) {
		// Prevent the default form submission
		event.preventDefault();

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
				// Display error message to the user
				error = result.message;
			}
		} catch (error) {
			console.error('Network or other error:', error);
			error = "error.unknown"
			// Handle network errors or other exceptions
		}
	}
</script>

<div class="p-4 bg-light rounded border">
	<h1 class="mb-4">{$t('common.register')}</h1>
	<form on:submit|preventDefault={register}>
		<div class="mb-3">
			<label for="username form-label">{$t('common.username')}:</label>
			<input id="username form-control" type="text" bind:value={username} required />
		</div>
		<div class="mb-3">
			<label for="password form-label">{$t('common.password')}:</label>
			<input id="password form-control" type="password" bind:value={password} required />
		</div>

		<input class="btn btn-primary" type="submit" value={$t('common.register')} />
		{#if error != null}
			<div class="alert alert-danger mt-4" role="alert">
				{$t(error)}
			</div>
		{/if}
	</form>
</div>


