<template>
  <VuePdf v-for="page in pageContentStore.numOfPages" :key="page" :src="pageContentStore.pdfSrc" :page="page" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { VuePdf } from 'vue3-pdfjs/esm';
import { usePageContentStore } from '@/store/PageContentStore'
import { mapStores } from 'pinia'


export default defineComponent({
  name: 'PageContent',
  components: { VuePdf },
  computed: {
    ...mapStores(usePageContentStore)
  }
});
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
