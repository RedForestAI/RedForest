<template>
  <main>
    <div id="scr-main-container">
      <div id="scr-page-container">
        <PageContent/>
      </div>
      <div :class="[configurationStore.quizHidden ? 'hidden-quiz' : 'right-side-panel']">
        <QuizContent/>
      </div>
    </div>
  </main>
</template>

<script>
import PageContent from '@/components/PageContent.vue'
import QuizContent from '@/components/QuizContent.vue'
import { useConfigurationStore } from '@/store/ConfigurationStore'
import { mapStores } from 'pinia'

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
#src-main-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}

#src-page-container {
  width: 100%;
}

.hidden-quiz {
  display: none;
}

</style>
