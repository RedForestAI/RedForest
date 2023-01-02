<template>
  <main>
    <div id="scr-main-container">
      <div id="scr-page-container">
        <PageContent/>
      </div>
      <Transition name="slide-fade">
        <div id="src-quiz-container" v-if="configurationStore.quizHidden">
          <QuizContent/>
        </div>
      </Transition>
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
}

#src-page-container {
  flex: 50%;
}

#src-quiz-container {
  flex: 50%;
}

/*
  Enter and leave animations can use different
  durations and timing functions.
*/
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

</style>
