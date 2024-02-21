"use client";

import { Course, Assignment, Activity, ActivityData, AssignmentData, Question } from '@prisma/client'
import { useState, useEffect } from 'react'
import { api } from "~/trpc/react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

import { triggerActionLog } from "~/loggers/actions-logger"

type QuestionConfig = {
  beforeStartPrompt: boolean
}

type QuestionsProps = {
  course: Course
  assignment: Assignment
  activity: Activity
  activityData: ActivityData
  questions: Question[]
  assignmentData: AssignmentData
  ammountOfActivities: number
  currentActId: number
  setCurrentActId: (id: number) => void

  complete: boolean
  setComplete: (complete: boolean) => void

  // Configs
  config?: Partial<QuestionConfig>
}

// Default configs
const defaultConfig: QuestionConfig = {
  beforeStartPrompt: false
}

type ScoreTrack = {
  answer: string
  correct: boolean
  pts: number
}

let scores: ScoreTrack[] = []

export default function Questions(props: QuestionsProps) {

  // Configs
  const finalConfig = {...defaultConfig, ...props.config}

  // State
  const router = useRouter()
  const { register, handleSubmit, clearErrors, reset, formState: { errors } } = useForm();
  const [ currentQuestionId, setCurrentQuestionId ] = useState<number>(props.activityData.currentQuestionId)
  const [ startQuestions, setStartQuestions ] = useState<boolean>(false)
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false)

  // Mutations
  const appendAnswerMutation = api.activityData.appendAnswer.useMutation()

  function getProgress() {
    const totalQuestions = props.questions.length;
    return Math.floor((currentQuestionId / totalQuestions) * 100);
  }

  function startQuestionsAction() {
    setStartQuestions(true)
    triggerActionLog({type: "questionStart", value: {start: true}})
  }

  async function onSubmit(data: any) {
    if (isSubmitting) return;
    setIsSubmitting(true)

    // Update choice in the database
    let response = {correct: false, pts: 0}
    try {
      response = await appendAnswerMutation.mutateAsync({
        activityDataId: props.activityData.id, 
        activityId: props.activity.id,
        index: currentQuestionId,
        answer: Number(data.answer)
      })
    } catch (error) {
      console.log(error)
      return;
    }

    // Add to the score
    scores.push({answer: data.answer, correct: response.correct, pts: response.pts})

    triggerActionLog({type: "questionSubmit", value: {
      currentQuestionId: currentQuestionId, 
      option: data.answer,
      correct: response.correct,
      pts: response.pts
    }});
    
    if (currentQuestionId < props.questions.length - 1) {
      setCurrentQuestionId(currentQuestionId + 1)
      triggerActionLog({type: "questionLoad", value: {upcomingQuestionId: currentQuestionId + 1}});
    } else {

      // Check for activity complete
      setCurrentQuestionId(currentQuestionId + 1)
      props.setComplete(true)

      // Compute the score and log again for redundancy
      let totalPtsEarned = 0
      let totalPtsPossible = 0
      scores.forEach(score => {
        if (score.correct) {
          totalPtsEarned += score.pts
        }
        totalPtsPossible += score.pts
      })
      let scorePercentage = (totalPtsEarned / totalPtsPossible) * 100
      triggerActionLog({type: "activityComplete", value: {complete: true, score: scorePercentage.toFixed(1), scores: scores}});
    }

    reset()
    setIsSubmitting(false)
  }

  useEffect(() => {
    if (!finalConfig.beforeStartPrompt) {
      triggerActionLog({type: "questionLoad", value: {upcomingQuestionId: currentQuestionId}});
    }
  }, [])

  return (
    <div className="items-start flex flex-col pt-3 pb-12 px-4">
    
    {finalConfig.beforeStartPrompt && !startQuestions
      ? <>
        <h1 className="text-2xl font-bold pb-8 text-5xl">Before starting!</h1>
        <p className="text-xl pb-8">
          Before starting questions, make sure to complete reading the passages. Once you have completed, then press Continue.
        </p>
        <button className="btn btn-primary" onClick={startQuestionsAction}>Continue</button>
      </>
      : <>

      <div className="bg-neutral self-stretch flex flex-col justify-center items-stretch rounded-2xl max-md:max-w-full mt-2">
        <div className="bg-primary text-xs font-medium text-primary-content text-center p-0.5 leading-none rounded-full" style={{width: `${getProgress()}%`}}> {getProgress()}%</div>
      </div>

      <div className="self-stretch text-5xl mt-2.5 max-md:max-w-full">
        Question {currentQuestionId + 1}
      </div>
      <div className="self-stretch text-lg mt-2.5 max-md:max-w-full">
        {props.questions[currentQuestionId]?.content}
      </div>
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        {props.questions[currentQuestionId]?.type === "MULTIPLE_CHOICE" &&
          // Iterate through each choice
          props.questions[currentQuestionId]?.options.map((choice, index) => {
            return (
              <div key={index} className="flex justify-start items-center w-full mt-4">
                <input {...register(`answer`, {required: true})} value={index} type="radio" className="radio mr-4 radio-primary" />
                <label className="text">{choice}</label>
              </div>
            )
          })
        }
        <div className="flex justify-end w-full items-center mt-4">
          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>Continue</button>
        </div>
      </form>

      </>
    }

    {errors.answer && 
      <div className="toast toast-end">
        <div className="alert alert-error flex flex-row">
          <span>Missing answer choice</span>
          <button className="btn btn-ghost" onClick={() => clearErrors("answer")}>Dismiss</button>
        </div>
      </div>
    }

    </div>
  )
}
