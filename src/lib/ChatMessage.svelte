<script>
	import { onMount } from 'svelte';
	import Geogebra from './Geogebra.svelte';

	/** @type {ChatHistoryMessage} */
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
				{#if con.type == 'text'}
					{con.text}
				{:else if con.type == 'image_url'}
					<img src={con.image_url.url} alt="user provided" />
				{/if}
			{/each}
		{/if}
	{/if}
</p>
