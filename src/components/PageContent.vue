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

</style>
