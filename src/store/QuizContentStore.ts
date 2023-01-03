import { defineStore } from 'pinia'

type Question = {
    prompt: string
    answers: string[]
}

type QuizDetails = {
    questions: Question[],
    correctAnswers: number[],
    selectedAnswers: number[],
    currentQuestionID: number,
    currentQuestionPrompt: string
    currentQuestionAnswers: string[]
}

export const useQuizContentStore = defineStore('quizContent', {
    state: () => {
        return {
            questions: [],
            correctAnswers: [],
            selectedAnswers: [],
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
        },
        getNextOrSubmit(state): boolean {
            return this.questions.length <= this.currentQuestionID + 1
        },
        getCorrectQuestionsCount(state): number {
            return 0
        }
    },
    actions: {
        loadQuizContent (quizContentPath: string) {

            // Load the question JSON
            fetch(quizContentPath)
                .then((res) => res.json())
                .then((data) => {
                    this.questions = data.questions
                    this.correctAnswers = data.answers
                    this.selectedAnswers = Array(this.questions.length).fill(-1)
                    this.loadQuizQuestion()
                })

        },
        loadQuizQuestion () {
            this.currentQuestionPrompt = this.getCurrentQuestionPrompt
            this.currentQuestionAnswers = this.getCurrentQuestionAnswers
        },
        updateQuestionAnswer (selection: number) {
            this.selectedAnswers[this.currentQuestionID] = selection
        },
        prevQuestion(currentQuestionSelectedAnswer: number) {
            this.updateQuestionAnswer(currentQuestionSelectedAnswer)
            if (this.currentQuestionID > 0) {
                this.currentQuestionID -= 1
                this.loadQuizQuestion()
            }
        },
        nextQuestion(currentQuestionSelectedAnswer: number) {
            this.updateQuestionAnswer(currentQuestionSelectedAnswer)
            if (this.currentQuestionID < this.questions.length - 1) {
                this.currentQuestionID += 1
                this.loadQuizQuestion()
            }
        }
    }
})