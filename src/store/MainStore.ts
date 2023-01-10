import { defineStore } from 'pinia'

// Load other stores
import { useModuleStore } from './ModuleStore'
import { useConfigurationStore } from './ConfigurationStore'
import { useQuizContentStore } from './QuizContentStore'
import { usePageContentStore } from './PageContentStore'

type MainStoreTypes = {
  config: Object;
}

export const useMainStore = defineStore('main', {
  state: () => {
    return {
      config: {}
    } as MainStoreTypes
  },
  actions: {
    initialize() {

      // Load configuration
      fetch(process.env.BASE_URL + "config.json")
        .then((res) => res.json())
        .then((config) => {
          this.config = config

          // Logging information
          console.log("Configuration: ")
          console.log(this.config)
      
          // Load module
          const moduleStore = useModuleStore()
          moduleStore.loadModule(this.config['modulePath'])
      }) 
    },
    exit() {
      // Reset all stores and reload content
      const moduleStore = useModuleStore()
      const quizContentStore = useQuizContentStore()
      const pageContentStore = usePageContentStore()
      const configurationStore = useConfigurationStore()

      moduleStore.$reset()
      quizContentStore.$reset()
      pageContentStore.$reset()
      configurationStore.$reset()

      // Reload module
      moduleStore.loadModule(this.config['modulePath'])
    }
  }
})