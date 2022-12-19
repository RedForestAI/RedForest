<template>
  <body>
    <div id='header'><AppHeader/></div>
    <div id='router-view'><router-view /></div>
    <div id='footer'><AppFooter/></div>
  </body>
</template>

<script>
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'

export default {
  name: "App",
  data() {
    return {
      sidebar_collapsed: true,
    }
  },
  components: {
    AppFooter,
    AppHeader
  },
  methods: {
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

body {
  margin: 0px;
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
  justify-content: flex-start;
}

</style>
