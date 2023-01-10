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
  width: 100%;
  background-color: #000000;
  color: #FFFFFF;
  text-align: center;
  z-index: 30;
}
</style>
