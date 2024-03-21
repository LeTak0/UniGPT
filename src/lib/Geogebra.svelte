<script>
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

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

	let fileBase64 = '';
	function updateApplet() {
		if (d != null) d.innerHTML = '';
		if (!browser) return;

		new GGBApplet({
			width: 500,
			height: 500,
			appletOnLoad(api) {
				api.setGridVisible(true);
				for (let expression of expressions) {
					api.evalCommand(expression.value);
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
	<div bind:this={d} />
	<button class="btn btn-primary m-2" on:click={download}> Download Geogebra File </button>
</div>
