<template>
  <main>
    <div id="scr-main-container">
      <div id="scr-page-container" :class="[configurationStore.quizHidden ? all : left ]">
        <PageContent/>
      </div>
      <div id="scr-quiz-container" v-if="!configurationStore.quizHidden">
        <QuizContent/>
      </div>
    </div>
    <div id="scr-glossary-tool" v-if="pageContentStore.glossaryShow">
      <GlossaryTool/>
    </div>
  </main>
</template>

<script>
import { mapStores } from 'pinia'

import PageContent from '@/components/PageContent.vue'
import QuizContent from '@/components/QuizContent.vue'
import GlossaryTool from '@/components/GlossaryTool.vue'
import { useConfigurationStore } from '@/store/ConfigurationStore'
import { usePageContentStore } from '@/store/PageContentStore'

export default {
  data() {
    return {
      all: 'scr-all',
      left: 'scr-left'
    }
  },
  components: {
    PageContent,
    QuizContent,
    GlossaryTool
  },
  computed: {
    ...mapStores(useConfigurationStore),
    ...mapStores(usePageContentStore) 
  }
}
</script>

<style scoped>

#scr-quiz-container {
  position: fixed;
  padding-top: 5em;
  padding-left: 1em;
  padding-right: 1em;
  width: 30%;
  top: 1em;
  right: 0;
  float: right;
  background-color: #444444;
  color: #FFFFFF;
  z-index: 15;
}

.scr-left {
  width: 70%;
}

.scr-all {
  float: left;
  width: 100%;
}

#scr-glossary-tool {
  position: fixed;
  bottom: 1em;
  width: 35%;
  right: 0;
  height: 20%;
  float: right;
  background-color: rgba(197, 196, 242, 0.95);
  z-index: 50;
}

</style>
