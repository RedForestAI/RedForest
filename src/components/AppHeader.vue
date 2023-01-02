<template>
  <div id="src-nav">
    <div id="scr-left-nav" class="scr-nav-column">
      <nav>
        <ul>
          <li><router-link to="/">SandCastle Reader</router-link></li>
        </ul>
      </nav>
    </div>
    <div id="scr-center-nav" class="scr-nav-column">
      <nav>
        <ul>
          <li><button>+</button></li>
          <span> 100%</span>
          <li><button>-</button></li>
        </ul>
      </nav>
    </div>
    <div id="scr-right-nav" class="scr-nav-column">
      <nav>
        <ul>
          <li><button v-on:click="configurationStore.toggleQuiz()">Quiz</button></li>
          <li><router-link to="/">Tutorial</router-link></li>
          <li><router-link to="/">Settings</router-link></li>
          <li><router-link to="/">Log Out</router-link></li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useConfigurationStore } from '@/store/ConfigurationStore'
import { mapStores } from 'pinia'

export default defineComponent({
  computed: {
    ...mapStores(useConfigurationStore)
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
