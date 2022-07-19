<template>
  <body>
  <AppHeader/>
  <router-view />
  <button @click="(event) => screenshot('KEY', event)">TEST</button>
  <AppFooter/>
  </body>
</template>

<script>
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import { AreasOfInterest } from '@/services/AreasOfInterest.js'

export default {
  components: {
    AppHeader,
    AppFooter,
  },
  methods: {
    screenshot(message, event) {
      AreasOfInterest.warn(message, event);
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}
</style>
