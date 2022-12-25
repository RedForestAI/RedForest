<template>
  <div id="page-container">
    <div id="sidebar-container">
      <div id="sidebar" v-if="display_sidebar == true" :class="{ expanded: display_sidebar }">
        <h1>Table of Contents</h1>
        <table id="page-table">
          <tr v-for="page in contentStore.contentPages" :key="page.title">
            <td class="page-entry">{{ page.title }}</td>
          </tr>
        </table>
      </div>
      <button class="sidebar-button" v-if="display_sidebar == false" v-on:click="toggleSidebar()"> > </button>
      <button class="sidebar-button" :class="{ expanded_button: display_sidebar }" v-if="display_sidebar == true" v-on:click="toggleSidebar()"> &lt; </button>
    </div>
    <div id="html-container">
      <div v-html="contentStore.currentPageHtml" class="load-html"></div>
      <div id="page-buttons">
        <button class="prev-button" @click="contentStore.prev()">Previous</button>
        <button class="next-button" @click="contentStore.next()">Next</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { usePageContentStore } from '@/store/PageContentStore'
import { mapStores } from 'pinia'

export default defineComponent({
  data() {
    return {
      display_sidebar: false as boolean
    }
  },
  methods: {
    toggleSidebar: function() {
      this.display_sidebar = !this.display_sidebar
    },
  },
  computed: {
    ...mapStores(usePageContentStore),
  },
})
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
#page-table {
  margin: 1em;
  border: 1px solid black;
  margin-left: auto;
  margin-right: auto;
  width: 90%;
  border-collapse: collapse;
}

.page-entry {
  border: 1px style black;
  box-shadow: 0 0 1px black;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
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
