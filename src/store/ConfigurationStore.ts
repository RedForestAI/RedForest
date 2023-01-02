import { defineStore } from 'pinia'

type ConfigurationDetails = {
    quizHidden: boolean
    zoom: number
}

export const useConfigurationStore = defineStore('configuration', {
    state: () => {
        return {
            quizHidden: true,
            zoom: 0.9
        } as ConfigurationDetails
    },
    actions: {
        toggleQuiz() {
            this.quizHidden = !this.quizHidden
            console.log("QuizHidden: " + this.quizHidden)
        },
        zoomIn() {
            if (this.zoom < 2) {
                this.zoom += 0.1
            }
        },
        zoomOut() {
            if (this.zoom > 0.1){
                this.zoom -= 0.1
            }
        }
    }
})