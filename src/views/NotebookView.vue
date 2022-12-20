<template>
  <main>
    <div class="container">
      <div class="column border-place">
        <PageContent/>
      </div>
      <div class="column">
        <QuizContent/>
      </div>
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
}

@media (min-width: 48em ) {
  .border-place {
    border-right: 1px solid black;
  }
  .column {
    flex: 48%;
  }
  .container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
  }
}
@media (max-width: 48em ) {
  .border-place {
    border-bottom: 1px solid black;
    padding-bottom: 1em;
  }
}

</style>
