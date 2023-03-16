<template>
  <v-footer id="scr-footer">
    <div>
      Copyright &copy; {{ year }} - Vanderbilt OELE Group
    </div>
  </v-footer>
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

<style scoped>
#scr-footer {
  width: 100%;
  background-color: #000000;
  color: #FFFF;
  text-align: center;
  z-index: 30;
}
</style>
