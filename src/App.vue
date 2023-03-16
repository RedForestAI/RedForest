<template>
  <v-app>
    <body>
      <div id='scr-header'><AppHeader/></div>
      <div id='scr-main-div'>
        <router-view />
      </div>
      <div id='scr-footer'><AppFooter/></div>
    </body>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'

export default defineComponent({
  name: "App",
  components: {
    AppFooter,
    AppHeader,
  },
})
</script>

<style lang="scss">
html {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

html, body {
  height: 100%;
}

body {
  display: flex;
  flex-direction: column;
}

:root {
  color-scheme: dark;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
}

#scr-header {
  margin-top: 0em;
  position: fixed;
  padding-top: 1em;
  padding-bottom: 1em;
  width: 100%;
  z-index: 30;
}

#scr-main-div {
  flex: 1 0 auto;
}

#scr-footer {
  flex-direction: column;
  width: 100%;
}

</style>
