<script>
	import { t } from '$lib/translations';
</script>

<div class="d-flex flex-column justify-self-start">
	<h1 class="align-center mt-4">{$t("common.welcome")}</h1>
	<div class="container-sm">
		<p>{$t("common.welcomeText")}</p>
	</div>

	<a class="btn btn-primary m-4 shadow" href="chat">
		{$t("common.welcomeButton")}
	</a>
</div>

