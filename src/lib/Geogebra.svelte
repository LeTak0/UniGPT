<script>
	import { t } from '$lib/translations';

	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let debug = false;

	/** @type {string}*/
	// @ts-ignore
	export let data;

	/** @type {GeogebraDocArguments}*/
	let parsed;
	$: try {
		parsed = JSON.parse(data);
	} catch (e) {
		console.error('Error parsing JSON', e);
	}

	$: expressions = parsed?.expressions;

	/** @type {HTMLDivElement}*/
	let d;

	onMount(() => {
		updateApplet();
	});

	let failed = false;
	let fileBase64 = '';
	async function updateApplet() {
		if (d != null) d.innerHTML = '';
		if (!browser) return;


		new GGBApplet({
			width: 500,
			height: 500,
			async appletOnLoad(api) {
				if(!debug) api.setErrorDialogsActive(false);
				api.setGridVisible(true);
				for (let expression of expressions) {
					if(debug) console.log(expression)
					let labels = api.evalCommandGetLabels(expression.value);
					if(labels){
						try { api.renameObject(labels[0], expression.label); } catch {}
						let splitLabels = labels.split(',');
						if (expression.color) {
							for (let label of splitLabels) {
								api.setColor(label, expression.color.red, expression.color.green, expression.color.blue);
							}
						}
					}else{
						if(!debug) failed = true;
					}
				}
				fileBase64 = api.getBase64();
			}
		}).inject(d);
	}

	// @ts-ignore
	$: expressions, updateApplet();

	function download() {
		const url = `data:application/octet-stream;base64,${fileBase64}`;
		const a = document.createElement('a');
		a.href = url;
		a.download = 'geogebra.ggb';
		a.click();
		URL.revokeObjectURL(url);
	}
</script>

<div>
	{#if failed}
		<div class="alert alert-danger">{$t('chat.geogebraFailed')}</div>
	{:else}
		<div bind:this={d} />
		<button class="btn btn-primary m-2" on:click={download}>{$t('chat.downloadGeogebra')}</button>
	{/if}
</div>
