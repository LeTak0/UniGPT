<script>
    import { onMount } from 'svelte';

    let users = []; // List of users

    // Function to fetch the list of users
    async function fetchUsers() {
        try {
            const response = await fetch('/api/users');
            if (response.ok) {
                const data = await response.json();
                users = data.users;
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    onMount(fetchUsers);
</script>

<h2>Admin Panel</h2>

<div class="users-box">
    <h3>Registered Users</h3>
    {#if users.length}
        <ul>
            {#each users as user}
                <li>{user.username}</li>
            {/each}
        </ul>
    {:else}
        <p>No users found.</p>
    {/if}
</div>

<style>
    .users-box {
        border: 1px solid #ccc;
        padding: 10px;
        margin-top: 20px;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        margin: 5px 0;
    }
</style>