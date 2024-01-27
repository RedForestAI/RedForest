"use server";
import { Role, ActivityData, Question } from "@prisma/client"
import AssignmentBase from "./_components/assignment-base";
import NavBar from "~/components/ui/navbar";

import { api } from '~/trpc/server';

export default async function Page({params}: {params: { courseId: string, assignmentId: string, activityId: string}}) {

  // Fetch the activity data
  const profile = await api.auth.getProfile.query();

  // If teacher, redirect to course page
  if (profile.role === Role.TEACHER) {
    return {
      redirect: {
        destination: `/access/course/${params.courseId}`,
        permanent: false,
      },
    }
  }

  const course = await api.course.getOne.query({courseId: params.courseId, profileId: profile.id});
  const assignment = await api.assignment.getOne.query({id: params.assignmentId})
  const activities = await api.activity.getMany.query({assignmentId: params.assignmentId})
  let assignmentData = await api.assignmentData.getOne.query({studentId: profile.id, assignmentId: params.assignmentId})

  // If no assignment data exists, create it
  if (!assignmentData) {
    assignmentData = await api.assignmentData.create.mutate({studentId: profile.id, assignmentId: params.assignmentId, totalActs: activities.length})
  }

  // Get the activity data for each activity
  let activityDatas: ActivityData[] = []
  for (const activity of activities) {
    let activityData = await api.activityData.getOne.query({activityId: activity.id, assignmentDataId: assignmentData.id})
    if (!activityData) {
      activityData = await api.activityData.create.mutate({activityId: activity.id, assignmentDataId: assignmentData.id})
    }
    activityDatas.push(activityData)
  }

  // Sorts the activities by their index
  activities.sort((a, b) => a.index - b.index)

  // Get all questions for each activity
  let questions: Question[][] = []
  for (const activity of activities) {
    const question = await api.question.getMany.query({activityId: activity.id})
    // Sort the questions by their index
    question.sort((a, b) => a.index - b.index)
    questions.push(question)
  }

  const data = {
    course,
    assignment,
    activities,
    activityDatas,
    questions,
    assignmentData
  }

  // console.log(data)

  return (
    <>
    <NavBar profile={profile} breadcrumbs={[{name: "\\", url: `/access`}, {name: course.name, url: `/access/course/${params.courseId}`}]}/>
    <div className="mt-4 ml-8 mr-8">
      <AssignmentBase {...data}/>
    </div>
  </>
  )
}