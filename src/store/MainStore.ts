import { defineStore } from 'pinia'

// Load other stores
import { usePageContentStore } from './PageContentStore'
import { useQuizContentStore } from './QuizContentStore'

export const useMainStore = defineStore('main', {
  actions: {
    initialize() {
    
      // Initialize the page content store
      const pageContent = usePageContentStore()
      // pageContent.loadContent("/content/climate_change/meta.json")
      pageContent.loadContent("/content/sandbox_content/meta.json")

      // Initialize the quiz content store
      const quizContent = useQuizContentStore()
      quizContent.loadQuizContent("/content/climate_change/questions.json")
    }
  }
})