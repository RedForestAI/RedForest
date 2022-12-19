<template>
  <main>
    <div id="pageContent">
      <PageContent/>
    </div>
    <div id="QuizContent">
      <QuizContent/>
    </div>
  </main>
</template>

<script>
import PageContent from '@/components/PageContent.vue'
import QuizContent from '@/components/QuizContent.vue'
export default {
  components: {
    PageContent,
    QuizContent
  }
}
</script>

<style>
main {
  display: flex;
  flex-flow: row wrap;
}
#pageContent {
  width: 49%;
  height: calc(100vh - 100px);
  border: 1px solid #ccc;
}
#quizContent {
  width: 49%;
  border: 1px solid #ccc;
}
</style>
