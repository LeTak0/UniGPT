<script>
	/** @type {import('./$types').LayoutData} */
	export let data;
	import { enhance } from '$app/forms';
	import { base } from '$app/paths';

</script>

<div class="previous">
	<div class="p-4 border border-primary-subtle rounded bg-primary-subtle">
		<h3>Start a new conversation!</h3>
		<br>
		<form method="POST" action="{base}/api/newChat" use:enhance>
			<input class="w-auto btn btn-primary" type="submit" value="New Chat" />
		</form>
	</div>
	
	{#if data.chats.length > 0}
		<div class="banner pt-4">
			<h3>Your previous conversations:</h3>
		</div>
		{#each data.chats as chat}
			<div class="p-4 border rounded bg-secondary-subtle">
				<h5>{chat.name}</h5>
				<br />	
				<a class="link-primary link-offset-2" href="{base}/chat/{chat.name}">Continue this conversation →</a>
			</div>
		{/each}
	{/if}
</div>

<style>
	.previous {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(30dvw, 1fr));
		grid-column-gap: 4rem;
		grid-row-gap: 2rem;
		padding: 3rem;
	}

	.banner {
		grid-column: 1 / -1;
	}
</style>
