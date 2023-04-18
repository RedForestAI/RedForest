<template>
  <v-card id="scr-login-box" class="mx-auto px-6 py-8" max-width="344">
    <v-form
      v-model="form"
      @submit.prevent="submitLogin"
    >
      <v-text-field
        v-model="username"
        :rules="[required]"
        class="mb-2"
        clearable
        label="Username"
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="[required]"
        clearable
        label="Password"
        placeholder="Enter your password"
      ></v-text-field>

      <br>

      <v-btn
        :disabled="!form"
        block
        color="success"
        size="large"
        type="submit"
        variant="elevated"
      >
        Sign In
      </v-btn>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import axios from 'axios'

import { useModuleStore } from '@/store/ModuleStore'
import { useConfigurationStore } from '@/store/ConfigurationStore'

export default defineComponent({
  data () {
    return {
      form: true,
      required: true,
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

              // Login
              this.configurationStore.logIn(this.username, this.password)

              // Load the correct protocol
              console.log(res.data)
              let path = ''
              if (res.data.module == 'A') {
                path = 'content/graduate_content_A/module.json'
              }
              else if (res.data.module == 'B') {
                path = 'content/graduate_content_B/module.json'
              }
              else {
                console.log("System Failure, could not determine the protocol for participant!")
              }
              this.moduleStore.loadModule(path)
              
              this.$router.push("/tutorial")
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
    ...mapStores(useConfigurationStore),
    ...mapStores(useModuleStore)
  }
})
</script>

<style scoped>
#scr-login-box {
  width:400px;
  height:400px;
  margin: auto;
  margin-top: 10em;
}
#options {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  margin-top: 2em;
}

.scr-login-inputs {
  height: 1em;
  width: 250px;
}
h1 {
  text-align: center;
}
</style>
