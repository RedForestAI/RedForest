<template>
  <v-app-bar id="scr-nav"
    color="primary"
    density="compact"
  >
    <v-app-bar-title id="scr-left-nav">
      SandCastle Reader
    </v-app-bar-title>

    <template v-slot:append>
      <div id="scr-right-nav">
        <v-btn v-if="!InNotebook && configurationStore.loggedIn && configurationStore.readingMode == 'digital'" v-on:click="configurationStore.toggleQuiz()">Quiz</v-btn>
        <v-btn v-if="configurationStore.loggedIn" v-on:click="logOut"> Log Out </v-btn>
      </div>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent } from 'vue'
import { useConfigurationStore } from '@/store/ConfigurationStore'
import { useMainStore } from '@/store/MainStore'
import { mapStores } from 'pinia'

export default defineComponent({
  methods: {
    logOut () {

      // Inform the Server of logout
      let formData = new FormData()
      formData.append('username', this.configurationStore.username)
      axios({
        method: 'post',
        url: this.configurationStore.serverLocation + '/logout',
        data: formData
      }).then((res) => {
        if (res.data.success){
          console.log("Successful logout")
        } 
        else {
          alert("Logout failed: " + res.data)
        }
      }).catch((error) => {
        alert("Server Failure (Logout failed): " + error.data)
      })

      // Then reset everything else
      this.mainStore.exit()
      this.$router.push("/")
    }
  },
  computed: {
    ...mapStores(useConfigurationStore),
    ...mapStores(useMainStore),
    inNotebook(): boolean {
      return ("notebook" == this.$route.name)
    }
  }
})
</script>

<style scoped>
#scr-nav {
}
.scr-nav-column {
  float: left;
  width: 33.3333%;
}

#scr-left-nav {
  text-align: left;
}
#scr-center-nav {
  text-align: center;
}
#scr-right-nav {
  text-align: right;
}

.hidden {
  visibility: hidden;
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
  color: #FFFFFF;
}

li button {
  background: none!important;
  border: none;
  padding: 0!important;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  color: #FFFFFF;
  cursor: pointer;
  font-size: 1em;
}
</style>
