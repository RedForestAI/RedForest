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
  </main>
</template>

<script>
import { mapStores } from 'pinia'

import PageContent from '@/components/PageContent.vue'
import QuizContent from '@/components/QuizContent.vue'
import { useConfigurationStore } from '@/store/ConfigurationStore'

export default {
  data() {
    return {
      all: 'scr-all',
      left: 'scr-left'
    }
  },
  components: {
    PageContent,
    QuizContent
  },
  computed: {
    ...mapStores(useConfigurationStore) // reference: configurationStore
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

</style>
