<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>

  <header>
    <div>
      <nav>
        <ul>
          <li><RouterLink to="/">Home</RouterLink></li>
          <li><RouterLink to="/about">About</RouterLink></li>
        </ul>
      </nav>
    </div>
  </header>

</template>

<style>
header {
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: .5rem 1rem;
}

nav {
  /* margin-left: auto; */
}

nav ul {
  list-style: none;
}

nav ul li {
  display: inline-flex;
  /* margin-left: 1rem; */
  padding: 0rem 0.5rem;
}
</style>
