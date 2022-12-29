import { defineStore } from 'pinia'

type ConfigurationDetails = {
    quizHidden: boolean
}

export const useConfigurationStore = defineStore('configuration', {
    state: () => {
        return {
            quizHidden: true
        } as ConfigurationDetails
    },
    actions: {
        toggleQuiz() {
            this.quizHidden = !this.quizHidden 
            console.log("QuizHidden: " + this.quizHidden)
        },
    }
})