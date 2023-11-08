<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let username = '';
  let password = '';

  async function register() {
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      // Redirect to login page or dashboard after successful registration
      goto('/login');
    } else {
      // Handle errors, e.g., show an error message
      console.error('Registration failed');
    }
  }
</script>

<form on:submit|preventDefault={register}>
  <label for="username">Username:</label>
  <input id="username" type="text" bind:value={username} required>

  <label for="password">Password:</label>
  <input id="password" type="password" bind:value={password} required>

  <button type="submit">Register</button>
</form>
