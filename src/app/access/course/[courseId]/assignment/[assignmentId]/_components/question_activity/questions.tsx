"use client";

import { Course, Assignment, Activity, ActivityData, AssignmentData, Question } from '@prisma/client'
import { useState } from 'react'
import { api } from "~/trpc/react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"

const triggerQuestionSubmission = (eventName: string, detail: any) => {
  // Create a custom event with a given name and detail object
  const event = new CustomEvent(eventName, { detail });
  // Dispatch the event on the document
  document.dispatchEvent(event);
};

const triggerActivitySubmission = (eventName: string, detail: any) => {
  // Create a custom event with a given name and detail object
  const event = new CustomEvent(eventName, { detail });
  // Dispatch the event on the document
  document.dispatchEvent(event);
};

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

export default function Questions(props: QuestionsProps) {

  // Configs
  const finalConfig = {...defaultConfig, ...props.config}

  // State
  const router = useRouter()
  const { register, handleSubmit, clearErrors, reset, formState: { errors } } = useForm();
  const [ currentQuestionId, setCurrentQuestionId ] = useState<number>(props.activityData.currentQuestionId)
  const [ startQuestions, setStartQuestions ] = useState<boolean>(false)

  // Mutations
  const appendAnswerMutation = api.activityData.appendAnswer.useMutation()

  function getProgress() {
    const totalQuestions = props.questions.length;
    return Math.floor((currentQuestionId / totalQuestions) * 100);
  }

  async function onSubmit(data: any) {

    // Update choice in the database
    try {
      await appendAnswerMutation.mutateAsync({id: props.activityData.id, answer: Number(data.answer)})
    } catch (error) {
      console.log(error)
      return;
    }

    triggerQuestionSubmission("questionSubmit", {type: "questionSubmit", value: {currentQuestionId: currentQuestionId, option: data.answer}});
    
    if (currentQuestionId < props.questions.length - 1) {
      setCurrentQuestionId(currentQuestionId + 1)
    } else {

      // Check for activity complete
      setCurrentQuestionId(currentQuestionId + 1)
      props.setComplete(true)
      triggerActivitySubmission("activityComplete", {type: "activityComplete", value: {complete: true}})
    }

    reset()
  }

  return (
    <div className="items-start flex flex-col pt-3 pb-12 px-4">
    
    {finalConfig.beforeStartPrompt && !startQuestions
      ? <>
        <h1 className="text-2xl font-bold pb-8 text-5xl">Before starting!</h1>
        <p className="text-xl pb-8">
          Before starting questions, make sure to complete reading the passages. Once you have completed, then press Continue.
        </p>
        <button className="btn btn-primary" onClick={() => setStartQuestions(true)}>Continue</button>
      </>
      : <>

      <div className="bg-neutral self-stretch flex flex-col justify-center items-stretch rounded-2xl max-md:max-w-full mt-5">
        <div className="bg-primary text-xs font-medium text-primary-content text-center p-0.5 leading-none rounded-full" style={{width: `${getProgress()}%`}}> {getProgress()}%</div>
      </div>

      <div className="self-stretch text-4xl mt-2.5 max-md:max-w-full">
        Question {currentQuestionId + 1}
      </div>
      <div className="self-stretch text mt-2.5 max-md:max-w-full">
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
          <button className="btn btn-primary" type="submit">Continue</button>
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