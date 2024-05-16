<script>
	import { t } from '$lib/translations';

	import { invalidate } from '$app/navigation';

	/** @type {boolean} */
	export let showModal;

	/** @type {HTMLDialogElement}*/
	let dialog;

	$: if (dialog && showModal) {
		dialog.showModal();
	}

	function close() {
		username = "";
		password = "";
		//role = "user";
		dialog.close();
	}

	async function save() {

		await fetch(`/api/users`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({username, password, role})
		})
		.then(async res => {
			if (!res.ok) throw new Error(await res.text());
			return res;
		})
		.then(async () => {
			await invalidate("app:admin:users");
			close();
		})
		.catch(err => {
			error = err.message;
		});

	}

	let username = '';
	let password = '';
	/** @type {string} */
	let role = 'user';

	/** @type {string | null} */
	let error = null;

	//$: if(role) console.log(role);

</script>

<dialog bind:this={dialog} on:close={() => { showModal = false; }} class="rounded border">
	<div class="row align-items-center mb-3">
		<div class="col">
			<h1>{$t('manage.createUser')}</h1>
		</div>
		<div class="col col-md-auto">
			<button type="button" class="btn-close" aria-label="Close" on:click={close} />
		</div>
	</div>
	<div class="d-flex flex-column justify-content-start align-items-start">
		<div class="input-group mb-3">
			<span class="input-group-text">{$t('common.username')}</span>
			<input
				type="text"
				class="form-control"
				placeholder={$t('common.username')}
				bind:value={username}
			/>
		</div>
		<div class="input-group mb-3">
			<span class="input-group-text">{$t('common.password')}</span>
			<input
				type="password"
				class="form-control"
				placeholder={$t('common.password')}
				bind:value={password}
			/>
		</div>
		<div class="btn-group mb-3">
			<div class="input-group">
				<span class="input-group-text">{$t('common.role')}</span>
				<input
					type="radio"
					class="btn-check"
					name="options"
					id="roleOptionUser1"
					autocomplete="off"
					value="user"
					bind:group={role}
					checked
				/>
				<label class="btn btn-outline-primary form-control" for="roleOptionUser1">User</label>
				<input
					type="radio"
					class="btn-check"
					name="options"
					id="roleOptionAdmin1"
					autocomplete="off"
					value="admin"
					bind:group={role}
				/>
				<label
					class="btn btn-outline-warning form-control justify-items-center pe-4"
					for="roleOptionAdmin1">Admin</label
				>
			</div>
		</div>
	</div>

	{#if error}
		<div class="alert alert-danger" role="alert">
			{error}
		</div>
	{/if}

	<div class="modal-footer col">
		<button type="button" class="btn btn-danger me-2" on:click={close}>
			{$t('common.discard')}
		</button>
		<button type="button" class="btn btn-primary" on:click={save}>{$t('common.create')}</button>
	</div>
</dialog>
