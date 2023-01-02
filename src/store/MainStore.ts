import { defineStore } from 'pinia'

// Load other stores
import { inject } from 'vue'
import { usePageContentStore } from './PageContentStore'
import { useQuizContentStore } from './QuizContentStore'

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
        
          // Initialize the page content store
          const pageContent = usePageContentStore()
          pageContent.loadPdf(this.config['pdfPath'])

          // Initialize the quiz content store
          const quizContent = useQuizContentStore()
          quizContent.loadQuizContent(this.config['questionPath'])
      }) 
    }
  }
})