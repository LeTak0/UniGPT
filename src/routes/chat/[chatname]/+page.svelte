<script>
	import { enhance } from '$app/forms';
	import { afterNavigate } from '$app/navigation';
	import { typesetPage } from '$lib/MathJaxHook';
	import { onMount, tick } from 'svelte';

	/** @type {import('./$types').PageData} */
	export let data;

	let messageInput = '';
	let requestRunning = false;

	/** @type {HTMLDivElement} */
	let scrollContainer;

	/**
	 * @param {{ preventDefault: () => void; }} e
	 */
	async function onSend(e) {
		e.preventDefault();

		if (requestRunning) return;
		requestRunning = true;
		data.history = [...data.history, { role: 'user', content: messageInput, name: 'You' }];

		data.history = [...data.history, { role: 'assistant', content: '', name: 'AI' }];

		await fetch('/api/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ message: messageInput, chat: data.chatname })
		}).then((res) => {
			if (!res.body) return;
			const reader = res.body.getReader();

			return new ReadableStream({
				start(controller) {
					scrollDown();
					pump();

					function pump() {
						reader.read().then(({ done, value }) => {
							if (done) {
								controller.close();
								typesetPage();
								scrollDown();
								return;
							}

							if (data.history) {
								data.history[data.history.length - 1].content += new TextDecoder().decode(value);
							}

							pump();
						});
					}
				}
			});
		});

		requestRunning = false;
		messageInput = '';
	}

	function scrollDown() {
		scrollContainer.scrollTop = scrollContainer.scrollHeight;
	}

	onMount(async () => {
		await typesetPage();
		scrollDown();
	});

	afterNavigate(async () => {
		await tick();
		await typesetPage();
		scrollDown();
	});
</script>

<svelte:head>
	<title>{data.chatname} - Chat</title>
	<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
	<script
		id="MathJax-script"
		async
		src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
	></script>
</svelte:head>

<div class="chat p-4 h-100">
	<form method="post" action="?/rename" class="input-group d-flex flex-row pb-4" use:enhance>
		<input
			class="border flex-grow-1 px-2 form-control"
			type="text"
			placeholder="Chat Title"
			bind:value={data.chatname}
			name="name"
			max="64"
			min="1"
			pattern="^[a-zA-Z0-9_\-!?. ]+$"
		/>
		<input class="btn btn-secondary" type="submit" value="Rename" />
	</form>
	<div class="flex-grow-1 overflow-y-scroll" bind:this={scrollContainer}>
		{#if data.history}
			{#each data.history as message (message)}
				<p><b>{message.role == 'user' ? 'You' : 'Assistant'}:</b> {message.content}</p>
			{/each}
		{/if}
		{#if data.history && data.history.length < 1}
			<p>Unable to load chat history</p>
		{/if}
		{#if requestRunning}
			<div class="d-flex flex-row align-items-center">
				<div class="spinner-border m-2" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
				<span>Assistant is thinking...</span>
			</div>
		{/if}
	</div>
	<form class="d-flex flex-row bg-light m-2 mt-3 p-2 bg-body rounded-4" on:submit={onSend}>
		<input
			class="flex-grow-1 bg-transparent border-0 px-2"
			type="text"
			placeholder="Send a message"
			bind:value={messageInput}
		/>
		<input class="p-1 ms-2 rounded-3 btn btn-primary px-2 py-1" type="submit" value="Senden" />
	</form>
</div>

<style>
	.chat {
		display: grid;
		grid-template-rows: min-content 1fr min-content;
	}
</style>
