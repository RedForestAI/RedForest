<template>
  <div v-for="page in pageContentStore.numOfPages" :key="page" class="scr-pdf-page">
    <VuePdf :src="pageContentStore.pdfSrc" :key="configurationStore.zoom" :page="page" :scale="configurationStore.zoom * 2"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { VuePdf } from 'vue3-pdfjs/esm'
import { mapStores } from 'pinia'

import { usePageContentStore } from '@/store/PageContentStore'
import { useConfigurationStore } from '@/store/ConfigurationStore'


export default defineComponent({
  name: 'PageContent',
  components: { VuePdf },
  computed: {
    ...mapStores(usePageContentStore),
    ...mapStores(useConfigurationStore)
  },
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
  background-color: #999999;
}

</style>
