"use client";

import { Course, Assignment, Activity, ActivityData, AssignmentData, Question } from '@prisma/client'
import { useState } from 'react'
import { api } from "~/trpc/react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import ActivityCompletion from "../activity-completion"

type QuestionActivityProps = {
  course: Course
  assignment: Assignment
  activity: Activity
  activityData: ActivityData
  questions: Question[]
  assignmentData: AssignmentData
  ammountOfActivities: number
  currentActId: number
  setCurrentActId: (id: number) => void
}

export default function QuestionActivity(props: QuestionActivityProps) {
  // State
  const router = useRouter()
  const { register, handleSubmit, clearErrors, reset, formState: { errors } } = useForm();
  const [ currentQuestionId, setCurrentQuestionId ] = useState<number>(props.activityData.currentQuestionId)
  const [ complete, setComplete ] = useState<boolean>(false)

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
    
    if (currentQuestionId < props.questions.length - 1) {
      setCurrentQuestionId(currentQuestionId + 1)
    } else {

      // Check for assignment complete
      setCurrentQuestionId(currentQuestionId + 1)
      setComplete(true)
    }

    reset()
  }

  return (
    <div className="items-start flex flex-col pt-3 pb-12 px-4">
      <div className="bg-neutral self-stretch flex flex-col justify-center items-stretch rounded-2xl max-md:max-w-full mt-5">
        <div className="bg-primary text-xs font-medium text-primary-content text-center p-0.5 leading-none rounded-full" style={{width: `${getProgress()}%`}}> {getProgress()}%</div>
      </div>
      {!complete  
       ? <>
          <div className="self-stretch text-4xl mt-2.5 max-md:max-w-full">
            Question {currentQuestionId + 1}
          </div>
          <div className="self-stretch text-xs mt-2.5 max-md:max-w-full">
            {props.questions[currentQuestionId]?.content}
          </div>
          <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
            {props.questions[currentQuestionId]?.type === "MULTIPLE_CHOICE" &&
              // Iterate through each choice
              props.questions[currentQuestionId]?.options.map((choice, index) => {
                return (
                  <div key={index} className="flex justify-start items-center w-full mt-4">
                    <input {...register(`answer`, {required: true})} value={index} type="radio" className="radio mr-4" />
                    <label className="text-xs">{choice}</label>
                  </div>
                )
              })
            }
            <div className="flex justify-end w-full items-center mt-4">
              <button className="btn btn-primary" type="submit">Continue</button>
            </div>
          </form>
        </>
        : <ActivityCompletion {...props} complete={complete}/>
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