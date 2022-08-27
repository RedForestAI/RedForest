<template>
  <body>
  <div id='sidebar'>
    <SideBar @CollapsedChangeEvent="doSomething"/>
  </div>
  <div id='router-view' :class="[{'collapsed': sidebar_collapsed}]">
    <router-view />
  </div>
  <div id='footer'><AppFooter/></div>
  </body>
</template>

<script>
import AppFooter from '@/components/AppFooter.vue'
import SideBar from '@/components/SideBar.vue'

export default {
  name: "App",
  data() {
    return {
      sidebar_collapsed: true,
    }
  },
  components: {
    AppFooter,
    SideBar,
  },
  methods: {
    doSomething(data) {
      this.sidebar_collapsed = data
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

#router-view {
  padding-left: 300px;
  transition: padding 0.2s linear;
}
#router-view.collapsed {
  padding-left: 70px;
  transition: padding 0.2s linear;
}

</style>
