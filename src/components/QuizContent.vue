<template>
  <div id="quiz-container">
    <h1 id="question-title">Question {{ quizContentStore.currentQuestionID + 1}}</h1>
    <p id="quiz-prompt">
    {{ quizContentStore.currentQuestionPrompt}}
    </p>
    <table>
      <tr v-for="answer in quizContentStore.currentQuestionAnswers" :key="answer.id">
        <td><input type="radio" class="answer-radio"></td>
        <td><p class="answer-text">{{ answer }}</p></td>
      </tr>
    </table>
    <div id="quiz-buttons">
      <button class="prev-button">Previous</button>
      <button class="next-button">Next</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { useQuizContentStore } from '@/store/QuizContentStore'
import { mapStores } from 'pinia'

export default defineComponent({
  data() {
    return {
      questions: [{message: "Integer pellentesque, dolor id tincidunt pharetra, eros risus ornare erat, auctor feugiat elit odio eu lorem. Nam ullamcorper rutrum laoreet."}, {message: "Integer pellentesque, dolor id tincidunt pharetra, eros risus ornare erat, auctor feugiat elit odio eu lorem. Nam ullamcorper rutrum laoreet."}, {message: "Integer pellentesque, dolor id tincidunt pharetra, eros risus ornare erat, auctor feugiat elit odio eu lorem. Nam ullamcorper rutrum laoreet."}, {message: "Integer pellentesque, dolor id tincidunt pharetra, eros risus ornare erat, auctor feugiat elit odio eu lorem. Nam ullamcorper rutrum laoreet."}]
    }
  },
  computed: {
    ...mapStores(useQuizContentStore) // reference: pageContentStore
  }
})
</script>

<style>
#quiz-container {
  padding: 1em;
}
#question-title {
  text-align: left;
}
#quiz-prompt {
  text-align: left;
}
#quiz-buttons {
  margin-top: 5em;
}
li {
  list-style: none;
}
.question-answer {
  text-align: left;
  width: 100%;
}
.answer-radio {
  float: left;
  width: 200%;
}
.answer-text {
  padding-left: 20px;
  display: inline-block;
}
.prev-button {
  float: left;
}
.next-button {
  float: right
}
</style>
