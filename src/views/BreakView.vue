<template>
  <v-card id="scr-break-box" class="mx-auto px-6 py-8" max-width="344"
    text="Take a small mental break and come back when you are ready to continue"
  >
    <template v-slot:title>
    Doing great, {{ configurationStore.username }}
    </template>

    <v-card-actions>
      <v-btn
        color="success"
        size="large"
        type="submit"
        variant="elevated"
        @click="continueModule"
      >
        Continue
      </v-btn>
    </v-card-actions>
  </v-card>
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
#scr-break-box {
  margin-top: 10em;
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
