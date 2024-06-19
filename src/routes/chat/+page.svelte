<script>
	import { t } from '$lib/translations';

	/** @type {import('./$types').LayoutData} */
	export let data;
	import { enhance } from '$app/forms';
	import { base } from '$app/paths';

	//limit to 6 chats
	$: displayedChats = data.chats.slice(0, 6);
</script>

<div class="previous overflow-y-auto">
	<div class="p-4 border border-primary-subtle rounded bg-primary-subtle">
		<h3>{$t('chat.startANew')}</h3>
		<br>
		<form method="POST" action="{base}/api/newChat" use:enhance>
			<input class="w-auto btn btn-primary" type="submit" value={$t('chat.newChat')} />
		</form>
	</div>
	
	{#if data.chats.length > 0}
		<div class="banner pt-4">
			<h3>{$t('chat.previousConversation')}</h3>
		</div>
		{#each displayedChats as chat}
			<div class="p-4 border rounded bg-body-secondary">
				<h5>{chat.name}</h5>
				<br />	
				<a class="link-primary link-offset-2" href="{base}/chat/{chat.name}">
					{$t('chat.continueConversation')}
				</a>
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
