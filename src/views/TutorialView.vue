<template>
  <div id="scr-page-container">
    <div class="scr-page-content">
      <div id="scr-tutorial-video">  
        <video controls>
          <source
            size="1080"
            :src='require("@/assets/videos/tutorial.mp4")'
            type="video/mp4"
          />
        </video>
      </div>
      <div id="scr-tutorial-info">
        <p id="scr-tutorial-prompt">Please watch the Tutorial video to explore the tools present in the SandCastle Reader. Proceed when finished.</p>
        <v-btn id="scr-button-continue" @click="tutorialContinue">
          Continue
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
      tutorialContinue() {
        this.$router.push("/notebook")
    }
  } 
})
</script>

<style scoped>

#scr-page-container {
  display: flex;
  justify-content: center;
}

#scr-tutorial-info {
  padding-top: 2em;
  display: inline-flex;
  width: 100%;
  font-size: 20px;
}

#scr-tutorial-prompt {
width: 90%;
}

#scr-button-continue {
  right: 0;
}

#scr-tutorial-video {
  padding-top: 10em;
  width: 100%;
  display: flex;
  justify-content: center;
}

</style>
