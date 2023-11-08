<script>
	import { onMount } from 'svelte';

	onMount(async () => {
		await import('bootstrap/dist/css/bootstrap.min.css')
		window.bootstrap = await import('bootstrap/dist/js/bootstrap.esm.js')
	})
</script>

<div class="d-flex flex-column app">
	<nav class="d-flex flex-row justify-content-between">
		<a href="/" class="navbar-brand brand px-4 py-3">
			<img src="/Logo_Uni_Siegen.svg" alt="UniGPT Logo" />
		</a>
		<div class="d-flex flex-row align-items-center p-4">
			<a class="nav-link p-2" href="/register">Register</a>
			<a class="nav-link p-2" href="/login">Login</a>
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
	}
</style>
