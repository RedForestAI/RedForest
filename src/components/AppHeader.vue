<template>
  <header>
    <div id="left_nav">
      <nav>
        <ul>
          <li><router-link to="/">Sandbox Reader</router-link></li>
        </ul>
      </nav>
    </div>
    <div id="right_nav">
      <nav>
        <ul>
          <li><button>Quiz</button></li>
          <li><router-link to="/">Tutorial</router-link></li>
          <li><router-link to="/">Settings</router-link></li>
          <li><router-link to="/">Log Out</router-link></li>
        </ul>
      </nav>
    </div>
  </header>

</template>

<style>
header {
  border-bottom: 1px solid;
  padding: .5rem 1rem;
  padding-bottom: 30px;
}

#left_nav {
  float: left;
}
#right_nav {
  float: right;
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

li a {
  text-decoration: none;
  color: #000000;
}

li button {
  background: none!important;
  border: none;
  padding: 0!important;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #000000;
  cursor: pointer;
  font-size: 1em;
}
</style>
