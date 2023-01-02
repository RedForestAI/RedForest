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
  position: relative;
  bottom: 0;
  padding-top: 0.25em;
  padding-bottom: 0.25em;
  width: 100%;
  background-color: #000000;
  color: #FFFFFF;
  text-align: center;
}
</style>
