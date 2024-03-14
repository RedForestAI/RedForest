"use client";

import { Profile, Course, Assignment, Activity, ActivityData, AssignmentData, ActivityType, Question } from '@prisma/client'
import { useState } from 'react'
import QuestionActivity from "./question_activity/QuestionActivity"
import ReadingActivity from "./reading_activity/ReadingActivity"
import ReadingBehaviorActivity from "./reading_behavior_activity/ReadingBehaviorActivity"

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
      case (ActivityType.READING_BEHAVIOR):
        // @ts-ignore
        return <ReadingBehaviorActivity {...activityData}/>
      default:
        return <p className="text-error">Failed to load activity</p>
    }

  }

  return (
    <div key={currentActId}>
      {getActivity()}
    </div>
  )
}