<script>
	import { t } from '$lib/translations';
	import { base } from "$app/paths";
</script>
<div class="d-flex flex-row w-100 h-100 bg-body">
	<nav class="nav flex-column">
		<a class="nav-link link-secondary fw-bold mt-2" href="{base}/admin">{$t('manage.adminPanel')}</a>
		<a class="nav-link" href="{base}/admin/users">{$t('manage.userManagement')}</a>
		<a class="nav-link" href="{base}/admin/gpt">{$t('manage.gptSettings')}</a>
	</nav>
	<div class="d-flex flex-column flex-grow-1">
		<slot />
	</div>
</div>