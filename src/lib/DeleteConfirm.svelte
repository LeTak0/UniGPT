<script>
	import { createEventDispatcher } from "svelte";
	let dispatch = createEventDispatcher();

	/** @type {boolean} */
	export let showModal;

	/** @type {HTMLDialogElement}*/
	let dialog;

	$: if (dialog && showModal) {
		dialog.showModal();
	}

	function close() {
		dialog.close();
		showModal = false;
	}

	function deleteConfirm(){
		dispatch('delete');
		close();
	}
</script>
<dialog bind:this={dialog} on:close={() => (showModal = false)} class="rounded border">
	<div class="row align-items-center">
		<div class="col">
			<h1>Delete</h1>
		</div>
		<div class="col col-md-auto">
			<button type="button" class="btn-close" aria-label="Close" on:click={close} />
		</div>
	</div>
	<p>Are you sure?</p>
	<slot />
	<button type="button" class="btn btn-danger me-2" on:click={deleteConfirm}>Yes, Delete</button>
</dialog>	