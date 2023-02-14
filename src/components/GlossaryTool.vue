<template>
  <div class="scr-glossary-container">
    <button id="scr-glossary-close"></button>
    <h1 class="scr-glossary-child"> {{ word }} </h1>
    <p class="scr-glossary-child"> {{ definition }} </p>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'GlossaryTool',
    data () {
      return {
        word: 'Test Word',
        definition: 'North American professional baseball organization that was formed in 1903 with the merger of the two U.S. professional baseball leagues—the National League (NL) and the American League (AL).'
      }
    },
})
</script>

<style>
.scr-glossary-child {
  overflow-y: auto;
}

.scr-glossary-container {
  position: relative;
  width: 100%;
  height: 100%;
  padding-top: 0.1em;
  padding-left: 1em;
  padding-right: 0.1em;
  flex-direction: column;
  overflow: auto;
}

#scr-glossary-close::before {
  content: "\2715"
}

#scr-glossary-close {
  text-align: center;
  font-size: 1.5em;
  /* border: none; */
  /* background: none; */
  background-color: rgba(200,200,200,1);
  color: white;
  position: absolute;
  top: 0;
  right: 1.5em;
  width: 40px;
  height: 40px;
}
</style>
