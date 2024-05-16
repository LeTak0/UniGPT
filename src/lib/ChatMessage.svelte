<script>
	import { onMount } from 'svelte';
	import Geogebra from './Geogebra.svelte';

	/** @type {import('openai/resources/index.mjs').ChatCompletionMessageParam} */
	export let data;

	/** @type {{[index: string]: string}} */
	let roleLookUp = {
		user: 'You',
		assistant: 'Assistant',
		tool: 'Tool'
	};
</script>

<p>
	{#if data.content}
		{#if data.role == 'tool'}
			<b>Geogebra</b>
			<Geogebra data={data.content} />
		{:else if typeof data.content == 'string' && data.content != ''}
			<b>{roleLookUp[data.role]}</b>
			{data.content}
		{:else}
			<b>{roleLookUp[data.role]}</b>
			{#each data.content as con (con)}
				{#if typeof(con) === 'string'}
					{con}
				{:else}
					{#if con.type == 'text'}
						{con.text}
					{:else if con.type == 'image_url'}
						<img src={con.image_url.url} alt="user provided" />
					{/if}
				{/if}
			{/each}
		{/if}
	{/if}
</p>
