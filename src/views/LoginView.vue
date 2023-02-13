<template>
  <div id="login-box">
    <h1>Login</h1> 
    <div id="inputs">
      <input v-model="username" id="username" name="username" placeholder="Username">
      <input v-model="password" id="password" name="password" placeholder="Password" type="password">
    </div>
    <div id="options">
      <router-link to="/">Or register!</router-link>
      <button @click="submitLogin">Next</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import axios from 'axios'

import { useConfigurationStore } from '@/store/ConfigurationStore'

export default defineComponent({
  data () {
    return {
      username: "", // type: string
      password: "" // type: string
    }
  },
  methods: {
    submitLogin() {

      // First, make sure the inputs are valid to begin with
      if (this.username == "" || this.password == ""){
        alert("Missing Username or Password!")
      }

      // Send login request to the backend
      else {

        // Create form data to send request
        let formData = new FormData()
        formData.append('username', this.username)
        formData.append('password', this.password)
        axios({
          method: 'post',
          url: this.configurationStore.serverLocation + '/login', 
          data: formData
        }
        ).then((res) => {

            // If login success, save username and password and move on
            if (res.data.success){
              this.configurationStore.logIn(this.username, this.password)
              this.$router.push("/notebook")
            }

            // Else, inform of failure
            else {
              alert("Login failed")
              this.password = ""
            }

        // Error Handling
        }).catch((error) => {
            alert("No Login Server Response - " + error.data)
        })
      }
    }
  },
  computed: {
    ...mapStores(useConfigurationStore)
  }
})
</script>

<style scoped>
#login-box {
  width:300px;
  height:400px;
  border:1px solid #000;
  margin: auto;
  margin-top: 10em;
  background-color: #AAAA;
  color: #FFFF
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
