<template>
  <div id="quiz-container">
    <h1 id="question-title">Question {{ quizQuestionNumber }}</h1>
    <p id="quiz-prompt">
    {{ quizPrompt }}
    </p>
    <table>
      <tr v-for="question in questions" :key="question.id">
        <td><input type="radio" class="question-radio"></td>
        <td><p class="question-text">{{ question.message }}</p></td>
      </tr>
    </table>
    <div id="quiz-buttons">
      <button class="prev-button">Previous</button>
      <button class="next-button">Next</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      quizQuestionNumber: 1,
      quizPrompt: "Question prompt!",
      questions: [{message: "Integer pellentesque, dolor id tincidunt pharetra, eros risus ornare erat, auctor feugiat elit odio eu lorem. Nam ullamcorper rutrum laoreet."}, {message: "Integer pellentesque, dolor id tincidunt pharetra, eros risus ornare erat, auctor feugiat elit odio eu lorem. Nam ullamcorper rutrum laoreet."}, {message: "Integer pellentesque, dolor id tincidunt pharetra, eros risus ornare erat, auctor feugiat elit odio eu lorem. Nam ullamcorper rutrum laoreet."}, {message: "Integer pellentesque, dolor id tincidunt pharetra, eros risus ornare erat, auctor feugiat elit odio eu lorem. Nam ullamcorper rutrum laoreet."}]
    }
  }
}
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
.question-radio {
  float: left;
  width: 100%;
}
.question-text {
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
