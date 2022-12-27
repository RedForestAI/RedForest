import { defineStore } from 'pinia'
import axios from 'axios'

type Question = {
    prompt: string
    answers: string[]
}

type QuizDetails = {
    questions: Question[]
    currentQuestionID: number,
    currentQuestionPrompt: string
    currentQuestionAnswers: string[]
}

export const useQuizContentStore = defineStore('quizContent', {
    state: () => {
        return {
            questions: [],
            currentQuestionID: 0,
            currentQuestionPrompt: '',
            currentQuestionAnswers: []
        } as QuizDetails
    },
    getters: {
        getCurrentQuestionPrompt(state): string {
            return this.questions[this.currentQuestionID].prompt
        },
        getCurrentQuestionAnswers(state): string[] {
            return this.questions[this.currentQuestionID].answers
        }
    },
    actions: {
        loadQuizContent (quizContentPath: string) {

            // Load the question JSON
            fetch(quizContentPath)
                .then((res) => res.json())
                .then((data) => {
                    this.questions = data
                })
            
            console.log("Loaded questions: " + this.questions)
        },
        loadQuizQuestion () {
            this.currentQuestionPrompt = this.getCurrentQuestionPrompt
            this.currentQuestionAnswers = this.getCurrentQuestionAnswers
        }
    }
})