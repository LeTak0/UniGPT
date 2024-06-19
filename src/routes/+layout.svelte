<script>
	import { t } from '$lib/translations';

	import { goto, invalidate, invalidateAll } from '$app/navigation';
	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	onMount(async () => {
		await import('bootstrap/dist/css/bootstrap.min.css');
		await import('bootstrap-icons/font/bootstrap-icons.css');
		window.bootstrap = await import('bootstrap/dist/js/bootstrap.esm.js');

		const query = window.matchMedia('(prefers-color-scheme: dark)');
		query.addEventListener('change', colorChange);
		colorChange();
	});

	function colorChange() {
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			document.documentElement.setAttribute('data-bs-theme', 'dark');
		} else {
			document.documentElement.removeAttribute('data-bs-theme');
		}
	}

	async function logout() {
		await fetch(`${base}/api/logout`, { method: 'DELETE' }).then(async () => {
			await invalidateAll();
			await goto(`${base}/`);
		});
	}

	/** @type {import('./$types').LayoutData} */
	export let data;
</script>

<svelte:document data-bs-theme="dark" />
<div class="app">
	<!--<div class="position-absolute top-0 end-0 alert alert-primary d-flex align-items-center alert-dismissible m-3" role="alert">
		<i class="bi bi-info-circle pe-2 "></i>
		<div>
			Succesfully logged out
		</div>
		<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
	</div>-->
	<nav class="d-flex flex-row justify-content-between bg-body align-items-center">
		<a
			href="/"
			class="navbar-brand brand mx-2 px-3 my-2 pt-2 pb-3 rounded d-flex flex-row justify-content-center align-items-center"
		>
			<img src="/Logo_Uni_Siegen.svg" id="logo" alt="UniGPT Logo" />
		</a>
		<div class="d-flex flex-row align-items-center p-4">
			{#if !data.username}
				<a class="nav-link p-2" href="{base}/register">{$t('common.register')}</a>
				<a class="nav-link p-2" href="{base}/login">{$t('common.login')}</a>
			{:else}
				{#if data.role === 'admin'}
					<a class="nav-link p-2 mx-4 link link-underline-primary" href="{base}/admin"
						>{$t('common.adminPanel')}</a
					>
				{:else}
					<a class="nav-link p-2 mx-4 link link-underline-primary" href="{base}/chat"
						>{$t('common.chat')}</a
					>
				{/if}
				<button class="btn btn-outline-primary" type="submit" on:click={logout}
					>{$t('common.logout')}</button
				>
			{/if}
		</div>
	</nav>
	<main class="d-flex align-items-center justify-content-center overflow-hidden">
		<slot />
	</main>
</div>

<style>
	@media (prefers-color-scheme: dark) {
		#logo {
			filter: invert(1) saturate(0);
		}

		.app {
			background: -webkit-radial-gradient(
				circle,
				hsl(192deg 56.81% 10.64%) -7%,
				hsla(220, 65%, 65%, 1) 220%
			) !important;
			background: -moz-radial-gradient(
				circle,
				hsl(192deg 56.81% 10.64%) -7%,
				hsla(220, 65%, 65%, 1) 220%
			) !important;

			background: -webkit-radial-gradient(
				circle,
				hsl(192deg 56.81% 10.64%) -7%,
				hsla(220, 65%, 65%, 1) 220%
			) !important;
		}
	}

	.brand img {
		max-height: 3rem;
	}

	.app {
		height: 100dvh;
		max-height: 100dvh;

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

		display: grid;
		grid-template-rows: min-content 1fr;
	}
</style>
