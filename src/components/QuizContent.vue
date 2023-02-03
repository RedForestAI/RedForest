<template>
  <div id="quiz-container">
      <h1 id="question-title">Question {{ quizContentStore.currentQuestionID + 1}}</h1>
    <p id="quiz-prompt">
    {{ quizContentStore.currentQuestionPrompt}}
    </p>
    <table>
      <tr v-for="(answer, index) in quizContentStore.currentQuestionAnswers" :key="answer">
        <td><input type="radio" name="question" class="answer-radio" v-model="currentQuestionSelectedAnswer" :value="index"></td>
        <td><p class="answer-text">{{ answer }}</p></td>
      </tr>
    </table>
    <div id="quiz-buttons">
      <button class="prev-button" v-on:click="prevQuestion">Previous</button>
      <button v-if="!quizContentStore.getNextOrSubmit" class="next-button" v-on:click="nextQuestion" :disabled="currentQuestionSelectedAnswer == -1">Next</button>
      <button v-if="quizContentStore.getNextOrSubmit" class="next-button" v-on:click="submitQuestions" :disabled="currentQuestionSelectedAnswer == -1">Submit</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { useQuizContentStore } from '@/store/QuizContentStore'
import { useModuleStore } from '@/store/ModuleStore'
import { mapStores } from 'pinia'

type QuizContentDetails = {
  currentQuestionSelectedAnswer: number,
  buttonDisabled: boolean
}

export default defineComponent({
  data() {
    return {
      currentQuestionSelectedAnswer: -1,
    } as QuizContentDetails
  },
  methods: {
    prevQuestion () {
      // Updating answer
      this.quizContentStore.prevQuestion(this.currentQuestionSelectedAnswer)
     
      // Reset
      this.currentQuestionSelectedAnswer = this.quizContentStore.getCurrentQuestionSelectedAnswer
      console.log(this.currentQuestionSelectedAnswer)
    },
    nextQuestion () {
      // Updating answer
      this.quizContentStore.nextQuestion(this.currentQuestionSelectedAnswer)
      
      // Reset
      this.currentQuestionSelectedAnswer = this.quizContentStore.getCurrentQuestionSelectedAnswer
      console.log(this.currentQuestionSelectedAnswer)
    },
    submitQuestions () {
      this.quizContentStore.updateQuestionAnswer(this.currentQuestionSelectedAnswer)
      if (this.moduleStore.lastPassage){
        this.$router.push('completion')
      }
      else {
        this.moduleStore.nextPassage()
        this.$router.push('break')
      }
    }
  },
  computed: {
    ...mapStores(useQuizContentStore), // reference: quizContentStore 
    ...mapStores(useModuleStore) // reference: moduleStore
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
