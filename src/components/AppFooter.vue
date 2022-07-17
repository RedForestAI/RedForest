<template>
  <footer>
    <p>Copyright &copy; 2022 - Vanderbilt OELE Group</p>
  </footer>
</template>

<script>
export default {
  computed: {
    year() {
      return Date().getFullYear()
    }
  }
}
</script>

<style>
footer {
  position: fixed;
  text-align: center;
  bottom: 0;
  width: 100%
}
</style>
