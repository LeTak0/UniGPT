<script>
	import { base } from '$app/paths';

</script>
<div class="previous">
	<div class="p-4 border border-primary-subtle rounded bg-primary-subtle">
		<h3>Welcome to the admin Panel!</h3>
	</div>
	<div class="banner">
		<h5>What would you like to do?</h5>
	</div>
	<div  class="p-4 border border-secondary-subtle rounded bg-secondary-subtle">
		<h5>Manage Users</h5>
		<a class="link-primary link-offset-2 pointer-cursor" href="{base}/admin/users">Go to user management →</a>
	</div>
	<div  class="p-4 border border-secondary-subtle rounded bg-secondary-subtle">
		<h5>GPT Settings</h5>
		<a class="link-primary link-offset-2 pointer-cursor" href="{base}/admin/gpt">Go to GPT settings →</a>
	</div>
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
