<template>
  <v-card id="scr-completion-box" class="mx-auto px-6 py-8" max-width="344"
    text="Thank you for participation in our study!"
  >
    <template v-slot:title>
    Completion!
    </template>

    <v-card-actions>
      <v-btn
        color="success"
        size="large"
        type="submit"
        variant="elevated"
        @click="returnToLogin"
      >
        Exit
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { mapStores } from 'pinia'

import { useMainStore } from '@/store/MainStore'
import { useConfigurationStore } from '@/store/ConfigurationStore'
import { useQuizContentStore } from '@/store/QuizContentStore'

export default defineComponent({
  methods: {
    returnToLogin() {
      this.mainStore.exit()
      this.$router.push('/') 
    }
  },
  computed: {
    ...mapStores(useConfigurationStore),
    ...mapStores(useQuizContentStore),
    ...mapStores(useMainStore)
  }
})
</script>

<style scoped>
#scr-completion-box {
  margin: auto;
  margin-top: 10em;
}

#exit-button {
  float: right;
  margin-right: 2em;
  margin-top: 6em;
}
h1 {
  text-align: center;
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
