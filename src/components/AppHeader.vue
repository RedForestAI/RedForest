<template>
  <div id="src-nav">
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
          <div :class="{ hidden: !inNotebook }">
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
          <li v-if="inNotebook"><button v-on:click="configurationStore.toggleQuiz()">Quiz</button></li>
          <li v-if="inNotebook"><router-link to="/">Tutorial</router-link></li>
          <li v-if="configurationStore.loggedIn"><button v-on:click="logOut"> {{ configurationStore.username + ", Log Out" }}</button></li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useConfigurationStore } from '@/store/ConfigurationStore'
import { useMainStore } from '@/store/MainStore'
import { mapStores } from 'pinia'

export default defineComponent({
  methods: {
    logOut () {
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
  content: "";
  display: table;
  clear: both;
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
