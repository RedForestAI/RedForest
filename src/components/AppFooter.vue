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
  margin-top: auto;
  text-align: center;
  width: 100%
}
</style>
