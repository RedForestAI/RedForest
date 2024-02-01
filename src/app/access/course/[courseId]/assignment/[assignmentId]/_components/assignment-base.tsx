"use client";

import { Profile, Course, Assignment, Activity, ActivityData, AssignmentData, ActivityType, Question } from '@prisma/client'
import { useState } from 'react'
import QuestionActivity from "./question_activity/question_activity"
import ReadingActivity from "./reading_activity/reading_activity"

type AssignmentBaseProps = {
  profile: Profile
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
      profile: props.profile,
      course: props.course,
      assignment: props.assignment,
      activity: props.activities[currentActId],
      activityData: props.activityDatas[currentActId],
      questions: props.questions[currentActId],
      assignmentData: props.assignmentData,
      ammountOfActivities: props.activities.length,
      currentActId: currentActId,
      setCurrentActId: setCurrentActId
    }

    switch (props.activities[currentActId]?.type) {
      case (ActivityType.READING):
        // @ts-ignore
        return <ReadingActivity {...activityData}/>
      case (ActivityType.QUESTIONING):
        // @ts-ignore
        return <QuestionActivity {...activityData}/>
      default:
        return <p>Failed to load activity</p>
    }

  }

  return (
    <div key={currentActId}>
      {getActivity()}
    </div>
  )
}