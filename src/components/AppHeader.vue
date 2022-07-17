<template>

  <header>
    <div>
      <nav>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/notebook">Notebook</router-link></li>
          <li><router-link to="/about">About</router-link></li>
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
  margin-left: auto;
}

nav ul {
  list-style-position: inside;
  margin: 0;
  padding-left: 0;
}

nav ul li {
  display: inline-flex;
  padding: 0rem 0.5rem;
}
</style>
