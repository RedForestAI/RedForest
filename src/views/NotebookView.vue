<template>
  <main>
    <div class="container">
      <div>
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
.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}

.hidden-quiz {
  display: none;
}

</style>
