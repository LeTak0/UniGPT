<script>
	import { base } from "$app/paths";
</script>
<div class="d-flex flex-row w-100 h-100 bg-light">
	<nav class="nav flex-column">
		<a class="nav-link link-secondary fw-bold mt-2" href="{base}/admin">Admin Panel</a>
		<a class="nav-link" href="{base}/admin/users">User Management</a>
		<a class="nav-link" href="{base}/admin/gpt">GPT Settings</a>
	</nav>
	<div class="d-flex flex-column flex-grow-1">
		<slot />
	</div>
</div>