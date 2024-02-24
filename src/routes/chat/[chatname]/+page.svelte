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

	/** @type {HTMLDivElement} */
	let uploadSection;

	/**
	 * @param {{ preventDefault: () => void; }} e
	 */
	async function onSend(e) {
		e.preventDefault();

		if(messageInput.length < 1) return;

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

			if(res.status != 200) {
				data.history[data.history.length - 1].content = "Sorry, we had trouble connecting to the AI. Please try again later.";
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

		uploadSection.addEventListener('dragover', onDragEnter);
		uploadSection.addEventListener('drop', onDragDrop);
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
			if(!reentered) {
				showUpload = false;
			}
		}, 1000);
	}

	function imageToBase64(file){
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = error => reject(error);
		});
	}

	let uploadedFiles = new Array();
	/**
	 * @param {{ preventDefault: () => void; stopPropagation: () => void; }} e
	 */
	function onDragDrop(e) {
		e.preventDefault();
		e.stopPropagation();
		showUpload = false;

		let file = e.dataTransfer.files.item(0);
		let base64 = '';

		if(file.type.startsWith('image/')) {
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => {
				if(reader.result) {
					base64 = reader.result.toString();
					console.log(base64);
				}
			};
		}

		console.log(base64);
	}

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
				<p>
					<b>{message.role == 'user' ? 'You' : 'Assistant'}:</b>
					{#if typeof message.content == 'string'}
						{message.content}
					{:else}
						{#each message.content as con (con)}
							{#if con.type == 'text'}
								{con.text}
							{:else if con.type == 'image_url'}
								<img src={con.image_url.url} alt="user provided"/>
							{/if}
						{/each}
					{/if}
				</p>
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
		<div class="d-flex flex-grow-1" bind:this={uploadSection} >
			<div class="w-100 flex-grow-1 attach {showUpload ? "visible":""}">
				<i class="bi bi-upload"></i>
				<p>Drag and drop an image here</p>
			</div>
			<input
				class="flex-grow-1 bg-transparent border-0 px-2"
				type="text"
				placeholder="Send a message"
				min="1"
				bind:value={messageInput}
			/>
		</div>
		<button class="btn btn-outline-secondary ms-2" on:click={() => showUpload = !showUpload}><i class="bi bi-upload"></i></button>
		<input class="p-1 ms-2 rounded-3 btn btn-primary px-2 py-1" type="submit" value="Senden" />
	</form>
</div>

<style>
	.chat {
		display: grid;
		grid-template-rows: min-content 1fr min-content;
	}

	.attach {
		background-color: var(--bs-gray-100);
		border-color: var(--bs-gray-200);
		position: relative;
		width:100%;
		height:100%;
		border:solid 0.2rem;
		border-radius: 0.5rem;
		border-style: dashed;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-flow: column;
		transition: max-height 0.5s, max-width 0s, opacity 0.5s;
		transition-timing-function: ease;
    	max-height: 0px;
		max-width: 0px;
		overflow: hidden;
		padding: 0rem;
		border: none;
		opacity: 0;
	}

	.attach i {
		font-size: 2rem;
	}

	.attach.visible {
    	max-height: 10dvh;
		max-width: 100dvw;
		padding: 4rem;
		border: dashed;
		opacity: 1;
	}

	.attach + input {
		transition: max-height 0.5s, max-width 0s;
		max-height: 100dvh;
		max-width: 100dvw;
	}

	.attach.visible + input {
		max-height: 0px;
		max-width: 0px;
	}
</style>
