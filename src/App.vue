<template>
  <body>
    <div id='header'><AppHeader/></div>
    <div id='router-view'><router-view /></div>
    <div id='footer'><AppFooter/></div>
  </body>
</template>

<script lang="ts">
// Then visual stuff
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'

// Initialized the store and perform any startup routines
import { useMainStore } from '@/store/MainStore'

export default {
  name: "App",
  setup() {
    const mainStore = useMainStore()
    mainStore.initialize()
    return mainStore
  },
  data() {
    return {
    }
  },
  components: {
    AppFooter,
    AppHeader,
  },
  methods: {
  }
}
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