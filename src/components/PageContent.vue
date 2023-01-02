<template>
  <div v-for="page in pageContentStore.numOfPages" :key="page" class="scr-pdf-page">
    <VuePdf :src="pageContentStore.pdfSrc" :page="page" :scale="scale"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { VuePdf } from 'vue3-pdfjs/esm'
import { mapStores } from 'pinia'

import { usePageContentStore } from '@/store/PageContentStore'


export default defineComponent({
  name: 'PageContent',
  components: { VuePdf },
  mounted() {
    document.addEventListener("keyup", this.onKeyUp)
  },
  unmounted() {
    document.addEventListener("keyup", this.onKeyUp)
  },
  data() {
    return {
      scale: 1
    }
  },
  computed: {
    ...mapStores(usePageContentStore)
  },
  methods: {
    onKeyUp(event) {
      if (event.key == '+' && event.ctrlKey) {
        console.log("zoom!")
      }
      if (event.key == '-' && event.ctrlKey) {
        console.log("zoom!")
      }
    }
  }
});
</script>

<style>
img {
  max-width: 100%;
  max-height: 100%;
}

.scr-pdf-page {
  display: flex;
  justify-content: center;
}

</style>
