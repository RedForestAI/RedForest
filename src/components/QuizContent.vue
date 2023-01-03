<template>
  <div id="quiz-container">
    <h1 id="question-title">Question {{ quizContentStore.currentQuestionID + 1}}</h1>
    <p id="quiz-prompt">
    {{ quizContentStore.currentQuestionPrompt}}
    </p>
    <table>
      <tr v-for="answer in quizContentStore.currentQuestionAnswers" :key="answer.id">
        <td><input type="radio" name="question" class="answer-radio" v-model="currentQuestionSelectedAnswer" value="quizContentStore.currentQuestionAnswers.indexOf(answer)"></td>
        <td><p class="answer-text">{{ answer }}</p></td>
      </tr>
    </table>
    <div id="quiz-buttons">
      <button class="prev-button" v-on:click="quizContentStore.prevQuestion(currentQuestionSelectedAnswer)">Previous</button>
      <button v-if="!quizContentStore.getNextOrSubmit" class="next-button" v-on:click="quizContentStore.nextQuestion(currentQuestionSelectedAnswer)">Next</button>
      <button v-if="quizContentStore.getNextOrSubmit" class="next-button" v-on:click="submitQuestions()">Submit</button>
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
      currentQuestionSelectedAnswer: -1,
    }
  },
  methods: {
    submitQuestions () {
      // this.quizContentStore.updateQuestionAnswer(this.currentQuestionSelectedAnswer)
      this.$router.push('completion')
    }
  },
  computed: {
    ...mapStores(useQuizContentStore) // reference: quizContentStore 
  }
})
</script>

<style>
#quiz-container {
  padding: 1em;
  min-height: 100vh;
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
  height: 15px;
  width: 15px;
  vertical-align: middle;
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
