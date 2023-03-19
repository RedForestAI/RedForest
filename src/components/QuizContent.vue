<template>
  <div id="quiz-container">
    <v-progress-linear id="question-load-bar" :model-value="(quizContentStore.currentQuestionID / quizContentStore.questions.length) * 100"></v-progress-linear>
    <h1 id="question-title">Question {{ quizContentStore.currentQuestionID + 1}}</h1>
    <p id="quiz-prompt">
    {{ quizContentStore.currentQuestion.prompt }}
    </p>
      <div v-if="quizContentStore.currentQuestion.type == 'open'">
        <v-textarea class="answer-textarea" name="question" rows="10" v-model="currentQuestionSelectedAnswer">
        </v-textarea>
      </div>
      <div v-else>
        <table>
          <tr v-for="(answer, index) in quizContentStore.currentQuestion.answers" :key="answer">
            <div class="scr-answers">
              <td><input type="radio" name="question" class="answer-radio" v-model="currentQuestionSelectedAnswer" :value="index"></td>
              <td><p class="answer-text">{{ answer }}</p></td>
            </div>
          </tr>
        </table>
      </div>
    <div id="quiz-buttons">
      <!-- <button class="prev-button" v-on:click="prevQuestion">Previous</button> -->
      <v-btn v-if="!quizContentStore.getNextOrSubmit" class="next-button" v-on:click="nextQuestion" :disabled="(currentQuestionSelectedAnswer == -1) || (currentQuestionSelectedAnswer.toString() == '')">Next</v-btn>
      <v-btn v-if="quizContentStore.getNextOrSubmit" class="next-button" v-on:click="submitQuestions" :disabled="(currentQuestionSelectedAnswer == -1) || (currentQuestionSelectedAnswer.toString() == '')">Submit</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import { useQuizContentStore } from '@/store/QuizContentStore'
import { useModuleStore } from '@/store/ModuleStore'
import { mapStores } from 'pinia'

type QuizContentDetails = {
  currentQuestionSelectedAnswer: number | string,
  value: Number
}

export default defineComponent({
  data() {
    return {
      currentQuestionSelectedAnswer: '',
      value: 10
    } as QuizContentDetails
  },
  methods: {
    prevQuestion () {
      // Updating answer
      this.quizContentStore.prevQuestion(this.currentQuestionSelectedAnswer)
     
      // Reset
      this.currentQuestionSelectedAnswer = this.quizContentStore.getCurrentQuestionSelectedAnswer()
    },
    nextQuestion () {
      // Updating answer
      this.quizContentStore.nextQuestion(this.currentQuestionSelectedAnswer)
      
      // Reset
      this.currentQuestionSelectedAnswer = this.quizContentStore.getCurrentQuestionSelectedAnswer()
    },
    submitQuestions () {
      this.quizContentStore.updateQuestionAnswer(this.currentQuestionSelectedAnswer)
      if (this.moduleStore.lastPassage){
        this.$router.push('completion')
      }
      else {
        this.moduleStore.nextPassage()
        this.$router.push('instruction')
      }
    }
  },
  computed: {
    ...mapStores(useQuizContentStore), // reference: quizContentStore 
    ...mapStores(useModuleStore), // reference: moduleStore
  }
})
</script>

<style scoped>
#quiz-container {
  padding: 1em;
  font-size: 20px;
  overflow-y: auto;
  max-height: 80vh;
}
#question-load-bar {
  margin-bottom: 1em;
}

#question-title {
  text-align: left;
}
#quiz-prompt {
  text-align: left;
  padding-top: 2em;
  padding-bottom: 1em;
}
#quiz-buttons {
  margin-top: 5em;
}
li {
  list-style: none;
}
.scr-answers {
  display: flex;
  padding-top: 3em;
  align-items: center;
}
.answer-radio {
  height: 20px;
  width: 20px;
  vertical-align: middle;
}
.answer-text {
  padding-left: 20px;
  display: inline-block;
}
.answer-textarea {
  display: block;
  width: 100%;
}
.prev-button {
  float: left;
}
.next-button {
  float: right
}
</style>
