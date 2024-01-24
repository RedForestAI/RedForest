"use client";

import { Course, Assignment, Activity, ActivityData, AssignmentData, ActivityType, Question } from '@prisma/client'
import { useState } from 'react'
import QuestionActivity from "./question_activity/question_activity"

type AssignmentBaseProps = {
  course: Course
  assignment: Assignment
  activities: Activity[]
  activityDatas: ActivityData[]
  questions: Question[][]
  assignmentData: AssignmentData
}

export default function AssignmentBase(props: AssignmentBaseProps) {
  const [ currentActId, setCurrentActId ] = useState<number>(props.assignmentData.currentActId)

  function getActivity() {

    const activityData = {
      course: props.course,
      assignment: props.assignment,
      activity: props.activities[currentActId],
      activityData: props.activityDatas[currentActId],
      questions: props.questions[currentActId],
      assignmentData: props.assignmentData,
      setCurrentActId: setCurrentActId
    }

    switch (props.activities[currentActId]?.type) {
      case (ActivityType.READING):
        return <h1>Reading</h1>
      case (ActivityType.QUESTIONING):
        return <QuestionActivity {...activityData}/>
    }
  }

  return (
    <>
      {getActivity()}
    </>
  )
}