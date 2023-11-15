<script>

	let messages = [{fromUser:false,message:"I am your mathematical assistant. I can help you with math related questions. Try asking me something like 'What is 2+2?' or 'What is the square root of 16?'"}];
	let messageInput = "";

	let requestRunning = false;

	let chat = "Chat"; // replace with random name

	/**
	 * @param {{ preventDefault: () => void; }} e
	 */
	async function onSend(e) {
		e.preventDefault();

		if (requestRunning) return;
		requestRunning = true;
		messages = [...messages, {fromUser:true, message:messageInput}];

		messages = [...messages, {fromUser:false, message:""}];

		await fetch("/api/chat", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ message: messageInput, chatTitle: chat }),
		}).then((res) => {
			if(!res.body) return;
			const reader = res.body.getReader();

			return new ReadableStream({
				start(controller) {
					pump();
					
					function pump() {
						
						reader.read().then(({ done, value }) => {
							
							if (done) {
								controller.close();
								return;
							}

							const chunk = value;
							const decoder = new TextDecoder().decode(chunk);
							const json = JSON.parse(decoder);

							if(json.message) {
								messages[messages.length-1].message += json.message;
							}
							console.log(json);

							pump();
						});
					}

				},
			});

		});

		requestRunning = false;
		messageInput = "";
	}

	async function createNewChat() {
		try {
			let response = await fetch("/api/new-chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ chatTitle: chat }),
			});
			if (response.ok) {
				messages = []; // Reset messages for the new chat
			} else {
				console.error("Failed to create a new chat");
			}
		} catch (err) {
			console.error("Error while creating a new chat", err);
		}
	}

</script>

<div class="d-flex flex-row w-100 h-100 bg-light">
	<div class="d-flex flex-column bg-body">
		<input class="m-2" type="text" bind:value={chat} placeholder="Chat Title" />
		<input class="m-2" type="submit" value="Neuer Chat" on:click={createNewChat}>
	</div>

	<div class="d-flex flex-column flex-grow-1 p-4">
		<div class="flex-grow-1">
			{#each messages as message}
				<p><b>{message.fromUser ? "You" : "Assistant"}:</b> {message.message}</p>
			{/each}
			{#if requestRunning}
				<div class="d-flex flex-row align-items-center">
					<div class="spinner-border m-2" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
					<span>Assistant is thinking...</span>
				</div>
			{/if}
		</div>
		<form class="d-flex flex-row bg-light m-1 p-2 bg-body rounded-4" on:submit={onSend}>
			<input class="flex-grow-1 bg-transparent border-0 px-2" type="text" placeholder="Send a message" bind:value={messageInput}>
			<input class="p-1 ms-2 rounded-3 btn btn-primary px-2 py-1" type="submit" value="Senden">
		</form>
	</div>
</div>