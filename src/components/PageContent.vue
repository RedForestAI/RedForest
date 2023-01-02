<template>
  <div v-for="page in pageContentStore.numOfPages" :key="page" class="scr-pdf-page">
    <VuePdf :src="pageContentStore.pdfSrc" :page="page" :scale="scale"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { VuePdf } from 'vue3-pdfjs/esm';
import { usePageContentStore } from '@/store/PageContentStore'
import { mapStores } from 'pinia'


export default defineComponent({
  name: 'PageContent',
  components: { VuePdf },
  data() {
    return {
      scale: 1
    }
  },
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

.scr-pdf-page {
  display: flex;
  justify-content: center;
}

</style>
