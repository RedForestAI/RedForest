<template>
  <div id="sandcastle-page-container">
    <div id="sidebar-container">
      <div id="reader-sidebar" v-if="displaySidebar == true" :class="{ expanded: displaySidebar }">
        <h1>Table of Contents</h1>
        <table id="page-table">
          <tr v-for="page in pageContentStore.contentPages" :key="page.title">
            <td class="page-entry">{{ page.title }}</td>
          </tr>
        </table>
      </div>
      <button class="sidebar-button" v-if="displaySidebar == false" v-on:click="toggleSidebar()"> > </button>
      <button class="sidebar-button" :class="{ expanded_button: displaySidebar }" v-if="displaySidebar == true" v-on:click="toggleSidebar()"> &lt; </button>
    </div>
    <div id="html-container">
      <div v-html="pageContentStore.currentPageHtml" class="load-html"></div>
      <div id="page-buttons">
        <button class="prev-button" v-on:click="pageContentStore.prevPage()">Previous</button>
        <button class="next-button" v-on:click="pageContentStore.nextPage()">Next</button>
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
      displaySidebar: false as boolean
    }
  },
  methods: {
    toggleSidebar: function() {
      this.displaySidebar = !this.displaySidebar
    },
  },
  computed: {
    ...mapStores(usePageContentStore) // reference: pageContentStore
  }
})
</script>

<style>
img {
  max-width: 100%;
  max-height: 100%;
}

#sandcastle-page-container{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}

#sidebar-container {
  align-items: stretch;
  z-index: 15;
}
#reader-sidebar {
  position: absolute;
}
.expanded {
  width: 400px;
  height: 100%;
  background-color: #FFFFFF;
}

.expanded_button {
  left: 400px;
}
.sidebar-button {
  height: 100%;
  position: absolute;
  z-index: 15;
}

#html-container {
  flex: 80%;
  padding: 1em;
  padding-left: 2em;
  z-index: 0;
}
#page-buttons {
  bottom: 0px;
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
