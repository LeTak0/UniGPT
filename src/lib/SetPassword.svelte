<script>
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

	function save(){
		
	}

	let newPassword = '';
</script>
<dialog bind:this={dialog} on:close={() => (showModal = false)} class="rounded border">
	<div class="row align-items-center  mb-4">
		<div class="col">
			<h1>Reset Password</h1>
		</div>
		<div class="col col-md-auto">
			<button type="button" class="btn-close" aria-label="Close" on:click={close} />
		</div>
	</div>
	<div class="input-group mb-3">
		<span class="input-group-text">Password</span>
		<input
			type="password"
			autocomplete="new-password"
			class="form-control"
			id="username"
			placeholder="New Password"
			bind:value={newPassword}
		/>
	</div>
	<div class="modal-footer col">
		<button type="button" class="btn btn-primary me-2" on:click={save}>Set Password</button>
	</div>
</dialog>	