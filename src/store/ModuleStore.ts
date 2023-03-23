import { defineStore } from 'pinia'
import { usePageContentStore } from '@/store/PageContentStore'
import { useQuizContentStore, Question } from '@/store/QuizContentStore'
import { useConfigurationStore } from '@/store/ConfigurationStore'

type IInstruction = {
  title: string
  prompt: string
}

type PassageData = {
  instructions: IInstruction
  type: string
  pdfPath: string
  questions: Question[]
  answers: number[]
}

type ModuleDetails = {
  moduleData: PassageData[]
  selectedAnswers: number[]
  contentID: number
}

export const useModuleStore = defineStore('module', {
  state: () => {
    return {
      moduleData: [],
      selectedAnswers: [],
      contentID: 0
    } as ModuleDetails
  },
  getters: {
    lastPassage(state): boolean {
      return this.contentID >= (this.moduleData.length-1)
    },
    passageHasInstructions(state): boolean {
      return this.moduleData[this.contentID].instructions.title != ''
    }
  },
  actions: {
    setQuizContent () {

      // New Quiz should be hidden
      const configurationStore = useConfigurationStore()
      configurationStore.quizHidden = true

      // Before setting quiz, make sure to record if data was record
      const quizContentStore = useQuizContentStore()

      // Clearing out previous quiz data
      quizContentStore.$reset()

      // Then setting new quiz content
      quizContentStore.setQuizContent(this.moduleData[this.contentID].questions)
      quizContentStore.loadQuizQuestion()
    },
    setPageContent () {
      const pageContentStore = usePageContentStore()
      pageContentStore.loadPdf(this.moduleData[this.contentID].pdfPath)
      pageContentStore.restart()
    },
    setPassage () {
      const configurationStore = useConfigurationStore()

      if (this.moduleData[this.contentID].type == 'digital') {
        configurationStore.readingMode = "digital" 

        this.setPageContent()
        this.setQuizContent()
      }
      else { // paper
        configurationStore.readingMode = "paper" 
        this.setQuizContent()
      }
    },
    nextPassage() {
      this.contentID += 1
      this.setPassage()
    },
    loadModule (modulePath: string) {

      // Load the question JSON
      fetch(modulePath)
        .then((res) => res.json())
        .then((data) => {
          this.moduleData = data.passages
          this.setPassage()
        })
    },
    startModule() {
      this.contentID = 0
      this.setPassage()
    }
  }
})
