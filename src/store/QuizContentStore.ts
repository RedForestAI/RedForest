import { defineStore } from 'pinia'
import emitter from '@/emitter'

// Abstract Class
export class Question {
  type: string
  prompt: string
  choice: string | number

  constructor(type: string, prompt: string) {
    if (this.constructor == Question) {
      throw new Error("Abstract class can't be instantiated")
    }
    
    this.type = type
    this.prompt = prompt
    this.choice = ''
  }

  updateStudentSolution(choice: string | number) {
    this.choice = choice
  }
}

export class MultiQuestion extends Question {
  answers: string[]
  solution: number

  constructor(prompt: string, answers: string[], solution: number) {
    super('multi', prompt)
    this.answers = answers
    this.solution = solution
  }
}

export class OpenQuestion extends Question {

  constructor(prompt: string) {
    super('open', prompt)
  }
}

type QuizDetails = {
  questions: Question[],
  currentQuestion: Question | null,
  currentQuestionID: number,
  currentQuestionPrompt: string
  currentQuestionAnswers: string[]
}

export const useQuizContentStore = defineStore('quizContent', {
  state: () => {
    return {
      questions: [],
      currentQuestionID: 0,
      currentQuestion: null,
      currentQuestionPrompt: '',
      currentQuestionAnswers: []
    } as QuizDetails
  },
  getters: {
    getNextOrSubmit(state): boolean {
      return this.questions.length <= this.currentQuestionID + 1
    }
    // getCorrectQuestionsCount(state): number {
    //   let correctCounter = 0
    //   console.log(this.correctAnswers, this.selectedAnswers)
    //   for (let i = 0; i < this.correctAnswers.length; i++) {
    //       if (this.correctAnswers[i] == this.selectedAnswers[i]) {
    //           correctCounter++;
    //       }
    //   }
    //   return correctCounter
    // }
  },
  actions: {
    setQuizContent (questions: any[]) {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i]
        if (q.type == 'multi') {
          const question = new MultiQuestion(q.prompt, q.answers, q.solution)
          this.questions.push(question)
        } else if (questions[i].type == 'open') {
          const question = new OpenQuestion(q.prompt)
          this.questions.push(question)
        }
        else {
          throw Error("Invalid question type")
        }

      }
    },
    loadQuizQuestion () {
      this.currentQuestion = this.questions[this.currentQuestionID]
    },
    updateQuestionAnswer (selection: number | string) {
      this.questions[this.currentQuestionID].updateStudentSolution(selection.valueOf())

      // Emit the initial state of everything
      emitter.emit('updateQuestionAnswer', {"currentQuestionID": this.currentQuestionID, 'newValue': selection.valueOf()})
    },
    getCurrentQuestionSelectedAnswer() {
      if (this.currentQuestion instanceof Question){
        return this.currentQuestion.choice
      }
      else {
        return 0
      }
    },
    prevQuestion(currentQuestionSelectedAnswer: number | string) {
      this.updateQuestionAnswer(currentQuestionSelectedAnswer)
      if (this.currentQuestionID > 0) {
        this.currentQuestionID -= 1
        this.loadQuizQuestion()
        
        // Emit the initial state of everything
        emitter.emit('prevQuestion', {"currentQuestionID": this.currentQuestionID})
      }
    },
    nextQuestion(currentQuestionSelectedAnswer: number | string) {
      this.updateQuestionAnswer(currentQuestionSelectedAnswer)
      if (this.currentQuestionID < this.questions.length - 1) {
        this.currentQuestionID += 1
        this.loadQuizQuestion()
        
        // Emit the initial state of everything
        emitter.emit('nextQuestion', {"currentQuestionID": this.currentQuestionID})
      }
    }
  }
})
