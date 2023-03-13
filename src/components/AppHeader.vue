<template>
  <div id="scr-nav">
    <div id="scr-left-nav" class="scr-nav-column">
      <nav>
        <ul>
          <li>SandCastle Reader</li>
        </ul>
      </nav>
    </div>
    <div id="scr-center-nav" class="scr-nav-column">
      <nav>
        <ul>
          <div :class="{ hidden: (!inNotebook || configurationStore.readingMode == 'paper') }">
            <li><button v-on:click="configurationStore.zoomIn()">+</button></li>
            <span> {{ (configurationStore.zoom * 100).toFixed(0) }}</span>
            <li><button v-on:click="configurationStore.zoomOut()">-</button></li>
          </div>
        </ul>
      </nav>
    </div>
    <div id="scr-right-nav" class="scr-nav-column">
      <nav>
        <ul>
          <li v-if="inNotebook && configurationStore.readingMode == 'digital'"><button v-on:click="configurationStore.toggleQuiz()">Quiz</button></li>
          <!-- 
          <li v-if="inNotebook"><router-link to="/notebook">Tutorial</router-link></li> 
          <li v-if="configurationStore.loggedIn"><button v-on:click="logOut"> {{ configurationStore.username + ", Log Out" }}</button></li>
          -->
        </ul>
      </nav>
    </div>
  </div>
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

<style>
#scr-nav {
  z-index: 30;
  height: 20px;
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
