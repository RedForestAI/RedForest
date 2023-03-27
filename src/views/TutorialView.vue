<template>
  <div id="scr-page-container">
    <div class="scr-page-content">
      <div id="scr-tutorial-video-container">  
        <video controls id="scr-tutorial-video">
          <source
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
import { mapStores } from 'pinia'
import { defineComponent } from 'vue'

import { useModuleStore } from '@/store/ModuleStore'

export default defineComponent({
  methods: {
    tutorialContinue() {
      this.moduleStore.startModule() 
      this.$router.push('instruction')
    }
  },
  computed: {
    ...mapStores(useModuleStore)
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
  padding-left: 10em;
  padding-right: 10em;
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

#scr-tutorial-video-container {
  padding-top: 10em;
  width: 100%;
  display: flex;
  justify-content: center;
}

#scr-tutorial-video {
  width: 70%
}

</style>
