<template>
  <div id="page-container">
    <div id="sidebar-container">
      <div id="sidebar" v-if="display_sidebar == true" :class="{ expanded: display_sidebar }">
        <h1>Table of Contents</h1>
        <li v-for="page in pageList" :key="page.id">
          {{ page.title }}
        </li>
      </div>
      <button class="sidebar-button" v-if="display_sidebar == false" v-on:click="toggleSidebar()"> > </button>
      <button class="sidebar-button" :class="{ expanded_button: display_sidebar }" v-if="display_sidebar == true" v-on:click="toggleSidebar()"> &lt; </button>
    </div>
    <div id="html-container">
      <div v-html="html" class="load-html"></div>
      <div id="page-buttons">
        <button class="prev-button">Previous</button>
        <button class="next-button">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      pageFilepath: '/content/climate_change/pages/introduction.html',
      pageList: [{title: "Page 1"}, {title: "Page 2"}, {title: "Page 3"}],
      html: null,
      display_sidebar: false
    }
  },
  methods: {
    toggleSidebar: function() {
      this.display_sidebar = !this.display_sidebar
    }
  },
  mounted () {
    axios
      .get(this.pageFilepath)
      .then(response => (this.html = response.data))
  }
}
</script>

<style>
img {
  max-width: 100%;
  max-height: 100%;
}

#page-container{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}
#sidebar-container {
  align-items: stretch;
}
#sidebar {
  position: absolute;
  z-index: 15;
}
#html-container {
  flex: 80%;
  padding: 1em;
  padding-left: 2em;
}
#page-buttons {
  margin-top: 5em;
}

.expanded {
  background: none no-repeat scroll 0 0 #fff;
  width: 400px;
  height: 100%;
}
.expanded_button {
  left: 400px;
}

.sidebar-button {
  height: 100%;
  position: absolute;
  z-index: 15;
}
.load-html {
  overflow: auto;
}

.prev-button {
  float: left;
}
.next-button {
  float: right;
}
</style>
