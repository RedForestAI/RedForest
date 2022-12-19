<template>
  <div v-html="html"></div>
  <div id="page-buttons">
    <button class="prev-button">Previous</button>
    <button class="next-button">Next</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      pageFilepath: '/content/climate_change/pages/introduction.html',
      html: null
    }
  },
  mounted () {
    axios
      .get(this.pageFilepath)
      .then(response => (this.html = response.data))
  }
}
</script>

<style>
#page-buttons {
  margin-top: 5em;
}

.prev-button {
  float: left;
}
.next-button {
  float: right
}
</style>
