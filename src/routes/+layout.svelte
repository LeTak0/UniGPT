<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	onMount(async () => {
		await import('bootstrap/dist/css/bootstrap.min.css');
		await import('bootstrap-icons/font/bootstrap-icons.css');
		window.bootstrap = await import('bootstrap/dist/js/bootstrap.esm.js');
	});

	async function logout() {
		await fetch(`${base}/api/logout`, { method: 'DELETE' }).then(() => {
			goto(`${base}/`);
		});
	}

	/** @type {import('./$types').LayoutData} */
	export let data;
</script>

<div class="d-flex flex-column app">
	<nav class="d-flex flex-row justify-content-between bg-body">
		<a href="/" class="navbar-brand brand px-4 py-3">
			<img src="/Logo_Uni_Siegen.svg" alt="UniGPT Logo" />
		</a>
		<div class="d-flex flex-row align-items-center p-4">
			{#if !data.username}
				<a class="nav-link p-2" href="{base}/register">Register</a>
				<a class="nav-link p-2" href="{base}/login">Login</a>
			{:else}
				{#if data.role === 'admin'}
					<a class="nav-link p-2 mx-4 link link-underline-primary" href="{base}/admin">Admin Panel</a>
				{:else}
					<a class="nav-link p-2 mx-4 link link-underline-primary" href="{base}/chat">Chat</a>
				{/if}
				<button class="btn btn-outline-primary" type="submit" on:click={logout}>Logout</button>
			{/if}
		</div>
	</nav>
	<main class="d-flex align-items-center justify-content-center flex-grow-1">
		<slot />
	</main>
</div>

<style>
	.brand img {
		max-height: 3rem;
	}

	.app {
		height: 100dvh;

		background: hsla(192, 81%, 84%, 1);

		background: radial-gradient(circle, hsla(192, 81%, 84%, 1) 20%, hsla(247, 73%, 69%, 1) 100%);

		background: -moz-radial-gradient(
			circle,
			hsla(192, 81%, 84%, 1) 20%,
			hsla(247, 73%, 69%, 1) 100%
		);

		background: -webkit-radial-gradient(
			circle,
			hsla(192, 81%, 84%, 1) 20%,
			hsla(247, 73%, 69%, 1) 100%
		);

	}
</style>
