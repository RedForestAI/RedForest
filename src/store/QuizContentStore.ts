import { defineStore } from 'pinia'

export type Question = {
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
        getCurrentQuestionSelectedAnswer(state): number {
            return this.selectedAnswers[this.currentQuestionID]
        },
        getCorrectQuestionsCount(state): number {
            let correctCounter = 0
            console.log(this.correctAnswers, this.selectedAnswers)
            for (let i = 0; i < this.correctAnswers.length; i++) {
                if (this.correctAnswers[i] == this.selectedAnswers[i]) {
                    correctCounter++;
                }
            }
            return correctCounter
        }
    },
    actions: {
        setQuizContent (questions: Question[], answers: number[]) {
            this.questions = questions
            this.correctAnswers = answers
            this.selectedAnswers = Array(questions.length).fill(-1)
        },
        loadQuizQuestion () {
            this.currentQuestionPrompt = this.getCurrentQuestionPrompt
            this.currentQuestionAnswers = this.getCurrentQuestionAnswers
        },
        updateQuestionAnswer (selection: number) {
            this.selectedAnswers[this.currentQuestionID] = selection.valueOf()
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