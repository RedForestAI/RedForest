
<template>
  <div id="break-box">
    <h1>Doing Great!</h1>
    <h3>{{ configurationStore.username }}</h3>
    <p>Take a break and come back when you are ready to continue</p>
    <button id="continue-button" @click="continueModule">Continue</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { mapStores } from 'pinia'

import { useConfigurationStore } from '@/store/ConfigurationStore'
import { useModuleStore } from '@/store/ModuleStore'

export default defineComponent({
  methods: {
    continueModule() {
      this.$router.push('notebook')
    }
  },
  computed: {
    ...mapStores(useConfigurationStore),
    ...mapStores(useModuleStore),
  }
})
</script>

<style scoped>
#break-box {
  width:300px;
  height:400px;
  border:1px solid #000;
  margin: auto;
  margin-top: 10em;
  background-color: #AAAA;
  color: #FFFF
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
