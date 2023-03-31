<template>
  <v-card id="scr-instruction-box" class="mx-auto px-6 py-8">
    <template v-slot:title>
    {{ moduleStore.moduleData[moduleStore.contentID].instructions.title }} 
    </template>
    
    <template v-slot:text>
    Read the text located in your workstation before continuing! Then press the "FINISHED" button.
    </template>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="success"
        size="large"
        type="submit"
        variant="elevated"
        @click="continueModule"
      >
      FINISHED
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { mapStores } from 'pinia'

import { useModuleStore } from '@/store/ModuleStore'
import { useConfigurationStore } from '@/store/ConfigurationStore'

export default defineComponent({
  methods: {
    continueModule() { 
      // If passages remaining, continue
      if (this.moduleStore.contentID < this.moduleStore.moduleData.length){
        this.$router.push('notebook')
      }
      else { // Else it's the end
        this.configurationStore.logOut()
        this.$router.push('/')
      }
    }
  },
  computed: {
    ...mapStores(useModuleStore),
    ...mapStores(useConfigurationStore)
  }
})
</script>

<style scoped>
#scr-instruction-box {
  margin-top: 10em;
  width: 40%;
  height: 30%;
}

#continue-button {
  float: right;
  margin-right: 2em;
  margin-top: 6em;
}
h1 {
  text-align:center;
}
h3 {
  text-align:center;
}
p {
    text-align: center;
    margin: 1em;
    margin-top: 4em;
}
</style>
