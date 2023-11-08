<script>
  import { goto } from '$app/navigation';
  let username = '';
  let password = '';

  async function register(event) {
    // Prevent the default form submission
    event.preventDefault();
    console.log('Register function called'); // Debugging line



      const result = await response.json();
      console.log('Response received:', result); // Debugging line

      if (response.ok) {
        // Registration was successful, redirect to the login page
        goto('/login');
      } else {
        // Handle errors, show message to the user
        console.error('Registration error:', result.error);
        // Display error message to the user
      }

      try {
      const response = await fetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

    } catch (error) {
      console.error('Network or other error:', error);
      // Handle network errors or other exceptions
    }
  }
</script>

<form on:submit={register}>
  <input type="text" bind:value={username} placeholder="Username" required>
  <input type="password" bind:value={password} placeholder="Password" required>
  <button type="submit">Register</button>
</form>
