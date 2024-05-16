<script>
	import { t } from '$lib/translations';
	import { base } from '$app/paths';

</script>
<div class="previous">
	<div class="p-4 border border-primary-subtle rounded bg-primary-subtle">
		<h3>{$t('manage.welcome')}</h3>
	</div>
	<div class="banner">
		<h5>{$t('manage.whatWouldYou')}</h5>
	</div>
	<div  class="p-4 border border-secondary-subtle rounded bg-secondary-subtle">
		<h5>{$t('manage.manageUsers')}</h5>
		<a class="link-primary link-offset-2 pointer-cursor" href="{base}/admin/users">{$t('manage.manageUsersLink')}</a>
	</div>
	<div  class="p-4 border border-secondary-subtle rounded bg-secondary-subtle">
		<h5>{$t('manage.manageGPT')}</h5>
		<a class="link-primary link-offset-2 pointer-cursor" href="{base}/admin/gpt">{$t('manage.manageGPTLink')}</a>
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
