<script>
	import { t } from '$lib/translations';
	import { get } from 'svelte/store'

	import { enhance } from '$app/forms';
	import { afterNavigate, invalidateAll } from '$app/navigation';
	import ChatMessage from '$lib/ChatMessage.svelte';
	import { typesetPage } from '$lib/MathJaxHook';
	import { onMount, tick } from 'svelte';

	let dragAndDropEnabled = false;

	/** @type {import('./$types').PageData} */
	export let data;

	let messageInput = '';
	let requestRunning = false;

	/** @type {HTMLDivElement} */
	let scrollContainer;

	/** @type {HTMLDivElement} */
	let uploadSection;

	/**
	 * @param {{ preventDefault: () => void; }} e
	 */
	async function onSend(e) {
		//e.preventDefault();

		if (messageInput.length < 1) return;

		if (requestRunning) return;

		requestRunning = true;
		data.history = [...(data.history ||[]), { role: 'user', content: messageInput, name: 'You' }];
		data.history = [...(data.history ||[]), { role: 'assistant', content: '', tool_calls: undefined, name: 'Assistant'}];

		await fetch('/api/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ message: messageInput, chat: data.chatname })
		}).then((res) => {
			if (!res.body) return;

			if (res.status != 200) {
				if(data.history) {
					data.history[data.history.length - 1].content = get(t)('chat.gptFailed');
				}
				return;
			}

			const reader = res.body.getReader();

			return new ReadableStream({
				start(controller) {
					scrollDown();
					pump();

					function pump() {
						reader.read().then(({ done, value }) => {
							if (done) {
								controller.close();
								invalidateAll();
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
		}).catch((err) => {
			console.error(err);
			if(data.history)
				data.history[data.history.length - 1].content = get(t)('chat.gptFailed');
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

		uploadSection.addEventListener('dragover', onDragEnter);
	});

	afterNavigate(async () => {
		await tick();
		await typesetPage();
		scrollDown();
	});

	let showUpload = false;
	let reentered = false;
	/**
	 * @param {{ preventDefault: () => void; stopPropagation: () => void; }} e
	 */
	function onDragEnter(e) {
		e.preventDefault();
		e.stopPropagation();
		showUpload = true;
		reentered = true;

		setTimeout(() => {
			if (!reentered) {
				showUpload = false;
			}
		}, 1000);
	}
	
	let form;

</script>

<svelte:head>
	<title>{data.chatname} - {$t('common.chat')}</title>
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
		<input class="btn btn-secondary" type="submit" value={$t('common.rename')} />
	</form>
	<div class="flex-grow-1 overflow-y-auto" bind:this={scrollContainer}>
		{#if data.history}
			{#each data.history as message (message)}
				<ChatMessage data={message} />
			{/each}
		{/if}
		{#if data.history && data.history.length < 1}
			<p class="fst-italic">{$t('chat.emptyChat')}</p>
		{/if}
		{#if requestRunning}
			<div class="d-flex flex-row align-items-center">
				<div class="spinner-border m-2" role="status">
					<span class="visually-hidden">{$t('common.loading')}</span>
				</div>
				<span>{$t('chat.thinking')}</span>
			</div>
		{/if}
	</div>
	<form
		class="d-flex flex-row bg-light m-2 mt-3 p-2 bg-body rounded-4 align-items-end"
		bind:this={form}
	>
		<div
			class="flex-grow-1 h-100 chat-input align-self-center {showUpload ? 'visible' : ''}"
			bind:this={uploadSection}
		>
			<div class="chat-attachment flex-grow">
				<i class="bi bi-upload fs-3" />
				<p>Drag and drop an image here</p>
			</div>
			<input
				class="h-100 chat-field bg-transparent border-0 px-2"
				type="text"
				placeholder={$t('chat.messageBoxPlaceholder')}
				min="1"
				bind:value={messageInput}
			/>
		</div>
		{#if showUpload}
			<button
				class="btn btn-outline-secondary ms-2 square"
				on:click={() => (showUpload = !showUpload)}><i class="bi bi-upload" /></button
			>
		{/if}
		<button class="btn btn-primary p-2 ms-2 rounded-circle square" on:click={() => onSend({preventDefault: () => {}})}
			><i class="bi bi-send" /></button
		>
	</form>
</div>

<style>
	.square {
		width: 2.5rem;
		height: 2.5rem;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.chat {
		display: grid;
		grid-template-rows: min-content 1fr min-content;
	}

	.chat-input {
		display: grid;
		grid-template-rows: 0px 1fr;

		transition: all 0.5s;
		transition-timing-function: ease;
	}

	.chat-input.visible {
		grid-template-rows: 1fr min-content;
	}

	.chat-input * {
		transition: all 0.5s;
		transition-timing-function: ease;
	}

	.chat-field {
		flex-grow: 1;
	}

	.chat-input .chat-attachment {
		height: 0px;
		flex-grow: 0;
		opacity: 0;
		margin-bottom: 0rem;
	}
	.chat-input.visible .chat-attachment {
		height: unset;
		flex-grow: 1;
		opacity: 1;
		padding: 1rem;
		margin-bottom: 0.4rem;
	}

	.chat-input .chat-field {
		height: unset;
		flex-grow: 1;
		opacity: 1;
	}

	.chat-attachment {
		display: flex;

		background-color: var(--bs-gray-100);
		border-color: var(--bs-gray-100);

		border: solid;
		border-width: 0.15rem;
		border-radius: 0.5rem;
		border-style: dashed;

		justify-content: center;
		align-items: center;
		flex-flow: column;

		overflow: hidden;
	}
</style>
