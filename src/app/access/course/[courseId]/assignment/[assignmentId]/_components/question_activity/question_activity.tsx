"use client";

import { Profile, Course, Assignment, Activity, ActivityData, AssignmentData, Question } from '@prisma/client'
import { useState } from 'react'
import ActivityCompletion from "../activity-completion"
import Questions from "./questions"

type QuestionActivityProps = {
  profile: Profile
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
  const [ complete, setComplete ] = useState<boolean>(false)

  return (
    <>
      {!complete  
       ? <Questions {...props} complete={complete} setComplete={setComplete}/> 
       : <ActivityCompletion {...props} complete={complete} isSubmitting={false}/>
      }
    </>
  )
}