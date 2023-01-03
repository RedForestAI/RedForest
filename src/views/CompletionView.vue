<template>
  <div id="completion-box">
    <h1>Completion!</h1>
    <h3>{{ configurationStore.username }}</h3>
    <h3>Score: {{ quizContentStore.getCorrectQuestionsCount }} / {{ quizContentStore.questions.length}} </h3>
    <p>Thank you for participating in our study!</p>
    <button id="return-button" @click="returnToLogin">Return</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { mapStores } from 'pinia'

import { useConfigurationStore } from '@/store/ConfigurationStore'
import { useQuizContentStore } from '@/store/QuizContentStore'

export default defineComponent({
  methods: {
    returnToLogin() {
      this.$router.push('/') 
    }
  },
  computed: {
    ...mapStores(useConfigurationStore),
    ...mapStores(useQuizContentStore)
  }
})
</script>

<style scoped>
#completion-box {
  width:300px;
  height:400px;
  border:1px solid #000;
  margin: auto;
  margin-top: 10em;
}

#return-button {
  float: right;
  margin-right: 2em;
  margin-top: 6em;
}

h3 {
  text-align:center;
}
p {
    text-align: center;
    margin: 1em;
    margin-top: 4em;
}
</style>