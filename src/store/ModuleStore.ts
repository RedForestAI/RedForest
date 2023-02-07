import { defineStore } from 'pinia'
import { usePageContentStore } from '@/store/PageContentStore'
import { useQuizContentStore, Question } from '@/store/QuizContentStore'
import { useConfigurationStore } from '@/store/ConfigurationStore'

type PassageData = {
    pdfPath: string,
    questions: Question[]
    answers: number[]
}

type ModuleDetails = {
    moduleData: PassageData[],
    selectedAnswers: number[],
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
        }
    },
    actions: {
        setQuizContent () {

            // New Quiz should be hidden
            const configurationStore = useConfigurationStore()
            configurationStore.quizHidden = true

            const quizContentStore = useQuizContentStore()
            // Before setting quiz, make sure to record if data was record
            this.selectedAnswers = this.selectedAnswers.concat(quizContentStore.selectedAnswers)

            // Clearing out previous quiz data
            quizContentStore.$reset()

            // Then setting new quiz content
            quizContentStore.setQuizContent(this.moduleData[this.contentID].questions, this.moduleData[this.contentID].answers)
            quizContentStore.loadQuizQuestion()
        },
        setPageContent () {
            const pageContentStore = usePageContentStore()
            pageContentStore.loadPdf(this.moduleData[this.contentID].pdfPath)
        },
        setPassage () {
            this.setPageContent()
            this.setQuizContent()
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
        }
    }
})
