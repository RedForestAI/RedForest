<template>
  <footer>
    <HighlightTool>
    <p><span id="w0" class="hl">Test</span> Copyright &copy; 2022 - Vanderbilt OELE Group</p>
    </HighlightTool>
  </footer>
</template>

<script lang="ts">
import HighlightTool from '@/components/HighlightTool.vue'
export default {
  components: {
    HighlightTool
  },
  computed: {
    year() {
      return Date().getFullYear()
    }
  }
}
</script>

<style>
footer {
  width: 100%;
  background-color: #FFFF;
  color: #000000;
  text-align: center;
  z-index: 30;
}
</style>
