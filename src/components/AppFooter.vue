<template>
  <footer>
    <p><span id="w0" class="hl">Test</span> Copyright &copy; {{ year }} - Vanderbilt OELE Group</p>
  </footer>
</template>

<script lang="ts">
export default {
  computed: {
    year() {
      let date = new Date().getFullYear()
      return date
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
