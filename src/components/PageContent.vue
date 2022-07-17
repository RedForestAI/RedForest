<template>
  <div v-html="html"></div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      pageFilepath: '/content/reduced_climate_change/pages/introduction.html',
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
