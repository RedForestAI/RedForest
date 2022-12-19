<template>
  <main>
    <div class="column border-right">
      <PageContent/>
    </div>
    <div class="column">
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
  content: "";
  display: table;
  clear: both;
}

.border-right {
  border-right: 1px solid black;
}

.column {
  float: left;
  width: 47%;
  padding: 1em;
}
</style>


