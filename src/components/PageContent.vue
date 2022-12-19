<template>
  <div id="page-container">
    <div v-html="html" class="load-html"></div>
    <div id="page-buttons">
      <button class="prev-button">Previous</button>
      <button class="next-button">Next</button>
    </div>
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
img {
  max-width: 100%;
  max-height: 100%;
}
#page-buttons {
  margin-top: 5em;
}
#page-container {
  padding: 1em;
}

.load-html {
  overflow: auto;
}

.prev-button {
  float: left;
}
.next-button {
  float: right;
}
</style>
