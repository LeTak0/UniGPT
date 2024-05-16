<script>
	import { t } from '$lib/translations';

	import { enhance } from '$app/forms';
	import { invalidate, invalidateAll } from '$app/navigation';
	import { base } from '$app/paths';
	import DeleteConfirm from './DeleteConfirm.svelte';
	import SetPassword from './SetPassword.svelte';

	/** @type {string | null} */
	export let username;

	/** @type {HTMLDialogElement}*/
	let dialog;

	$: if (dialog && username) {
		//check if dialog is open
		if (!dialog.open) {
			fetch(`/api/users/${username}`)
				.then((res) => res.json())
				.then((data) => {
					currentUsername = data.username;
					currentRole = data.role;
				});
		}
		dialog.showModal();
	}

	function close() {
		dialog.close();
		username = null;
	}

	async function deleteConfirm() {
		await fetch(`/api/users/${username}`, { method: 'DELETE' });
		await invalidate("app:admin:users");
		close();
	}

	async function save() {
		if(!username) return;
		let form = new URLSearchParams();
		form.append('username', username);
		form.append('newUsername', currentUsername);
		form.append('role', currentRole);

		await fetch(`/api/users/${username}`, {
			method: 'PATCH',
			body: form
		});
		await invalidate("app:admin:users");
		close();
	}

	let currentUsername = '';
	let currentRole = '';

	let showDeleteConfirm = false;
	let showPasswordReset = false;
</script>

<DeleteConfirm bind:showModal={showDeleteConfirm} on:delete={deleteConfirm} />
<SetPassword bind:showModal={showPasswordReset} bind:username={currentUsername}/>
<dialog bind:this={dialog} on:close={() => (username = null)} class="rounded border">
	<div class="row align-items-center mb-3">
		<div class="col">
			<h1>{$t('manage.editUser')}</h1>
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
				id="username"
				placeholder="Username"
				bind:value={currentUsername}
			/>
		</div>
		<div class="btn-group mb-3">
			<div class="input-group">
				<span class="input-group-text">{$t('common.role')}</span>
				<input
					type="radio"
					class="btn-check"
					name="options"
					id="roleOptionUser"
					autocomplete="off"
					value="user"
					bind:group={currentRole}
					checked
				/>
				<label class="btn btn-outline-primary form-control" for="roleOptionUser">User</label>
				<input
					type="radio"
					class="btn-check"
					name="options"
					id="roleOptionAdmin"
					autocomplete="off"
					value="admin"
					bind:group={currentRole}
				/>
				<label
					class="btn btn-outline-warning form-control justify-items-center pe-4"
					for="roleOptionAdmin">Admin</label
				>
			</div>
		</div>
		<div class="btn-group mb-3">
			<span class="input-group-text">{$t('common.password')}</span>
			<button
				type="button"
				class="btn btn-secondary me-2"
				on:click={() => (showPasswordReset = true)}>{$t('common.reset')}</button
			>
		</div>
	</div>

	<div class="modal-footer col">
		<button type="button" class="btn btn-danger me-2" on:click={() => (showDeleteConfirm = true)}>
			{$t('common.delete')}
		</button>
		<button type="button" class="btn btn-primary" on:click={save}>{$t('common.save')}</button>
	</div>
</dialog>
