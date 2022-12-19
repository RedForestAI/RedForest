<template>
  <div id="page-container">
    <div id="sidebar-container">
      <button class="sidebar-button" v-if="display_sidebar == false"> > </button>
      <button class="sidebar-button" v-if="display_sidebar == true"> &lt; </button>
    </div>
    <div id="html-container">
      <div v-html="html" class="load-html"></div>
      <div id="page-buttons">
        <button class="prev-button">Previous</button>
        <button class="next-button">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      pageFilepath: '/content/climate_change/pages/introduction.html',
      html: null,
      display_sidebar: true
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

#page-container{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
}
#sidebar-container {
  align-items: stretch;
}
#html-container {
  flex: 80%;
  padding: 1em;
}
#page-buttons {
  margin-top: 5em;
}

.sidebar-button {
  height: 100%;
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
