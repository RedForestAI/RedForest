<template>
  <div id="login_box">
    <h1>Login</h1> 
    <div id="inputs">
      <input name="username" placeholder="Username">
      <input name="password" placeholder="Password" type="password">
    </div>
    <div id="options">
      <router-link to="/">Or register!</router-link>
      <button>Next</button>
    </div>
  </div>
</template>

<script>
  export default {
  }
</script>

<style>
#login_box {
  width:300px;
  height:400px;
  border:1px solid #000;
  margin: auto;
  margin-top: 10em;
}
#inputs {
  text-align: center;
  margin-top: 8em;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-around;
  height: 100px;
}
#options {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  margin-top: 2em;
}

input {
  height: 1em;
  width: 250px;
}
h1 {
  text-align: center;
}
</style>
