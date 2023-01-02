<template>
  <body>
    <div id='header'><AppHeader/></div>
    <div id='router-view'><router-view /></div>
    <div id='footer'><AppFooter/></div>
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

body {
  margin: 0px;
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
}

</style>