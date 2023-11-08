<script>

</script>

<style>
  .logo img {
    width: 100px; /* Adjust this value to scale down the logo */
    height: auto; /* This will maintain the aspect ratio */
    position: absolute;
    top: 0;
    left: 0;
    margin: 1rem;
  }
  nav {
    padding-left: 120px; /* Adjust this value based on the new size of your logo */
  }


</style>

<a href="/" class="logo">
  <img src="/Logo_Uni_Siegen.svg" alt="UniGPT Logo" />
</a>

<!-- Your navigation and other layout content -->


<nav>
  <a href="/">Home</a>
  <a href="/register">Register</a>
  <a href="/login">Login</a>
  <!-- Add other navigation links here -->
</nav>

<slot />
