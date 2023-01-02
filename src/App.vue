<template>
  <body>
    <div id='scr-header'><AppHeader/></div>
    <div id='scr-main-div'>
      <router-view />
      <div id='scr-footer'><AppFooter/></div>
    </div>
  </body>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import { useMainStore } from '@/store/MainStore'

export default defineComponent({
  name: "App",
  setup() {
    const mainStore = useMainStore()
    mainStore.initialize()
    return {
      mainStore
    }
  },
  components: {
    AppFooter,
    AppHeader,
  },
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}

#scr-header {
  margin-top: 0em;
  position: fixed;
  padding-top: 1em;
  padding-bottom: 1em;
  background-color: #000000;
  width: 100%;
  z-index: 30;
  color: #FFFFFF;
}

#scr-main-div {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#scr-footer {
  bottom: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  // padding-top: 0.25em;
}

body {
  margin: 0px;
}

</style>