<template>
  <div class="scr-glossary-container">
    <button id="scr-glossary-close" @click="closeGlossary"></button>
    <h1 class="scr-glossary-child"> {{ pageContentStore.glossaryWord }} </h1>
    <p class="scr-glossary-child"> {{ pageContentStore.glossaryDefinition }} </p>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'

import { usePageContentStore } from '@/store/PageContentStore'

export default defineComponent({
  name: 'GlossaryTool',
  methods: {

    closeGlossary () {
      this.$mitt.emit("glossaryClose", {"closing": true})
      this.pageContentStore.glossaryShow = false  
    }

  },
  computed: {
    ...mapStores(usePageContentStore)
  }
})
</script>

<style>
.scr-glossary-child {
  overflow-y: auto;
}

.scr-glossary-container {
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 0.1em;
  padding-left: 1em;
  padding-right: 0.1em;
  flex-direction: column;
  overflow: auto;
}

#scr-glossary-close::before {
  content: "\2715"
}

#scr-glossary-close {
  text-align: center;
  font-size: 1.5em;
  /* border: none; */
  /* background: none; */
  background-color: rgba(200,200,200,1);
  color: white;
  position: absolute;
  top: 0;
  right: 1.5em;
  width: 40px;
  height: 40px;
}
</style>
