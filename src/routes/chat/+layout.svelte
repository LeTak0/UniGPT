<script>
	/** @type {import('./$types').LayoutData} */
	export let data;
	
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	/**
	 * @param {string} chatName
	 */
	function switchChat(chatName) {
		goto(`${base}/chat/${chatName}`);
	}
</script>

<div class="d-flex flex-row w-100 h-100 bg-light">
	<div class="d-flex flex-column bg-body">
		<b class="text-center">Your Chats</b>
		<form class="w-100 d-flex justify-content-center" method="POST" action="{base}/api/newChat" use:enhance>
			<input class="m-2 w-auto btn btn-primary" type="submit" value="New Chat" />
		</form>
		{#if data.chats}
			{#each data.chats as chat}
				<button class="button btn-light border mx-2 my-1 px-2 py-1 btn chat-title text-nowrap text-truncate" on:click={() => switchChat(chat.name)}>{chat.name}</button>
			{/each}
		{:else}
			<p class="m-2">No chats yet</p>
		{/if}
	</div>

	<div class="d-flex flex-column flex-grow-1">
		<slot />
	</div>
</div>

<style>
	.chat-title {
		max-width: 15ch;
	}
</style>