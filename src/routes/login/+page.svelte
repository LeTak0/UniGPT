<script>
	import { t } from '$lib/translations'

	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	/** @type {import('./$types').ActionData} */
	export let form;
</script>

<div class="p-4 bg-body rounded border">
	<h1 class="mb-4">{$t('common.login')}</h1>
	<form class="grid" method="post" use:enhance>
		<label for="username" class="form-label">{$t('common.username')}:</label>
		<input id="username" class="form-control" type="text" required name="username" />

		<label for="password" class="form-label">{$t('common.password')}:</label>
		<input id="password" class="form-control" type="password" required name="password"/>

		<input class="btn btn-primary" type="submit" value={$t('common.login')} />
		
		{#if form?.message}
			<div class="alert alert-danger mt-2 py-2" role="alert">
				{$t(form.message)}
			</div>
		{/if}
	</form>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: min-content 1fr;
		grid-gap: 1rem;
	}
</style>
