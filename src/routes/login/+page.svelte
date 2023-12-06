<script>
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	/** @type {import('./$types').ActionData} */
	export let form;
</script>

<div class="p-4 bg-light rounded border">
	<h1 class="mb-4">Login</h1>
	<form method="post" use:enhance>
		<div class="mb-3">
			<label for="username form-label">Username:</label>
			<input id="username form-control" type="text" required name="username" />
		</div>
		<div class="mb-3">
			<label for="password form-label">Password:</label>
			<input id="password form-control" type="password" required name="password"/>
		</div>

		<input class="btn btn-primary" type="submit" value="Login" />
		
		{#if form?.message}
			<div class="alert alert-danger mt-2 py-2" role="alert">
				{form.message}
			</div>
		{/if}
	</form>
</div>
