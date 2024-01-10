<script>
	/** @type {import('./$types').LayoutData} */
	export let data;

	import { enhance } from '$app/forms';
	import { goto, invalidate } from '$app/navigation';
	import { base } from '$app/paths';
	import DeleteConfirm from '$lib/DeleteConfirm.svelte';

	/**
	 * @param {string} chatName
	 */
	function switchChat(chatName) {
		goto(`${base}/chat/${chatName}`);
	}

	let deleteConfirmOpen = false;
	let deleteChatName = '';
	/** @param {string} chatname */
	function deleteChat(chatname){
		deleteConfirmOpen = true;
		deleteChatName = chatname;
	}

	function deleteConfirm(){
		deleteConfirmOpen = false;
		fetch(`${base}/api/chat`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ chat: deleteChatName })
		}).then(async (res) => {
			await invalidate("app:user:chats");
			goto(`${base}/chat`);
		});
	}
</script>

<div class="layout w-100 h-100 bg-light">
	<DeleteConfirm showModal={deleteConfirmOpen} on:delete={deleteConfirm} />
	<div class="d-flex flex-column bg-body">
		<a class="text-center text-black fw-bold text-decoration-none" href="/chat">Your Chats</a>
		<form
			class="w-100 d-flex justify-content-center"
			method="POST"
			action="{base}/api/newChat"
			use:enhance
		>
			<input class="m-2 w-auto btn btn-primary" type="submit" value="New Chat" />
		</form>
		<div class="chats">
			{#if data.chats}
				{#each data.chats as chat}
					<button
						class="btn btn-light border btn chat-title text-nowrap text-truncate"
						on:click={() => switchChat(chat.name)}>{chat.name}</button
					>
					<button
						class="btn btn-outline-danger border-danger"
						on:click={() => deleteChat(chat.name)}><i class="bi bi-trash"></i></button>
				{/each}
			{:else}
				<p class="m-2">No chats yet</p>
			{/if}
		</div>
	</div>

	<div class="d-flex flex-column flex-grow-1">
		<slot />
	</div>
</div>

<style>
	.chat-title {
		max-width: 15ch;
	}

	.chats {
		display: grid;
		grid-template-columns: 1fr auto;
		grid-gap: 0.5rem;
		padding: 0.5rem;
	}

	.layout {
		display: grid;
		grid-template-columns: minmax(10dvw, min-content) 1fr;
	}
</style>
