<template>
  <main>
    <div id="scr-main-container">
      <div id="scr-page-container">
        <PageContent/>
      </div>
      <div id="scr-quiz-container" v-if="configurationStore.quizHidden">
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
  components: {
    PageContent,
    QuizContent
  },
  computed: {
    ...mapStores(useConfigurationStore) // reference: configurationStore
  }
}
</script>

<style>
#scr-main-container {
  display: flex;
}

#scr-page-container {
  flex: 70%;
}

#scr-quiz-container {
  padding-top: 5em;
  padding-left: 1em;
  padding-right: 1em;
  flex: 30%;
  float: left;
  background-color: #444444;
  color: #FFFFFF;
}

</style>
