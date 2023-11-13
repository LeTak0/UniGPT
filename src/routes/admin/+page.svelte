<script>
    import { onMount } from 'svelte';
    let users = [];
    let username = '';
    let password = '';

    // Function to fetch the list of users
    async function fetchUsers() {
        const response = await fetch('/api/users');
        users = await response.json();
    }

    // Function to handle form submission
    async function createUser(event) {
        event.preventDefault();
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            username = '';
            password = '';
            await fetchUsers(); // Refresh the user list
        } else {
            console.error('Failed to create user');
        }
    }

    onMount(fetchUsers);
</script>

<h2>Admin Panel</h2>

<!-- User Creation Form -->
<form on:submit={createUser}>
    <label>
        Name:
        <input type="text" bind:value={username} />
    </label>
    <label>
        Password:
        <input type="password" bind:value={password} />
    </label>
    <button type="submit">Create User</button>
</form>

<!-- User List -->
<h3>Users:</h3>
<ul>
    {#each users as user}
        <li>{user[0]}</li>
    {/each}
</ul>
