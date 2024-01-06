<script>
	import DeleteConfirm from '$lib/DeleteConfirm.svelte';
	import ManageUser from '$lib/ManageUser.svelte';

	/** @type {import('./$types').LayoutData} */
	export let data;
	
	/** @type {string | null} */
	let username = null;

	/** @type {{[key : string] : boolean}} */
	let selection = {};

	$: selected = Object.keys(selection).filter(key => selection[key]);

	let showDeleteConfirm = false;

	function deleteMultipleConfirm(){
		//TODO
		close();
	}
</script>

<div class="container p-4">
	<DeleteConfirm bind:showModal={showDeleteConfirm} on:delete={deleteMultipleConfirm}>
		<p>This action will delete the following users:</p>
		<ul>
			{#each selected as username}
				<li>{username}</li>
			{/each}
		</ul>
	</DeleteConfirm>
	<ManageUser bind:username />
	<h1 class="pb-2">Users</h1>
	<div class="pb-4 btn-toolbar justify-content-between" role="toolbar">
		<div>
			<input type="button" class="btn me-2 btn-primary" value="New User" />
			<input type="button" class="btn me-2 btn-danger" value="Delete" disabled={selected.length < 1} on:click={() => showDeleteConfirm = true}/>
		</div>
		<!-- No good way to perform search yet
		<div class="input-group flex-nowrap">
			<input type="text" class="form-control" placeholder="Search" />
			<input type="button" class="btn btn-primary" value="Search" />
		</div>-->
	</div>
	<table class="table align-middle">
		<thead>
			<tr class="fw-bold">
				<th />
				<th>Username</th>
				<th>Role</th>
				<th>Manage</th>
			</tr>
		</thead>
		<tbody class="">
			{#if data.users}
				{#each data.users as user}
					<tr>
						<td
							><input
								type="checkbox"
								class="form-check-input"
								bind:checked={selection[user.username]}
							/></td
						>
						<td>{user.username}</td>
						<td class="{user.role == "admin" ? "text-warning" : ""}">{user.role}</td>
						<td
							><input
								type="button"
								class="btn btn-light border-secondary"
								value="Manage"
								on:click={() => (username = user.username)}
							/></td
						>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
