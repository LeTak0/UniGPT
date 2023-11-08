<script>
  import { goto } from '$app/navigation';
</script>

<nav>
  <a href="/" on:click|preventDefault={() => goto('/')}>Home</a>
  <a href="/register" on:click|preventDefault={() => goto('/register')}>Register</a>
  <a href="/login" on:click|preventDefault={() => goto('/login')}>Login</a>
  <!-- Add other navigation links here -->
</nav>

<slot />
