"use server";
import { ActivityType } from "@prisma/client"
import Slot from "~/utils/slot";
import NavBar from "~/components/ui/navbar";

import { api } from '~/trpc/server';

export default async function Page({params}: {params: { courseId: string, assignmentId: string, activityId: string}}) {

  // Fetch the activity data
  const profile = await api.auth.getProfile.query();
  const course = await api.course.getOne.query({courseId: params.courseId, profileId: profile.id});
  const activities = await api.activity.getMany.query({assignmentId: params.assignmentId})

  // Sorts the activities by their index
  activities.sort((a, b) => a.index - b.index)

  // Iterate through the activities and try to pull the user data for each one
  const activityDatas = await Promise.all(activities.map(async (activity) => {
    const data = await api.activityData.getOne.query({activityId: activity.id, profileId: profile.id})
    return data
  }))

  console.log(activities)
  console.log(activityDatas)

  function getCurrentActivity() {
    // Iterate through the activities and try to pull the user data for each one
    // activities.forEach((activity, index) => {
    for (let i = 0; i < activities.length; i++) {
      let activityData = activityDatas[i]

      if (activityData && activityData.completed) {
        return <h1>Activity completed</h1>
      }
      switch (activities[i]?.type) {
        case ActivityType.READING:
          return <h1>Reading activity</h1>
        case ActivityType.QUESTIONING:
          return <h1>Questioning activity</h1>
        default:
          return <h1>Failed to load activity</h1>
      }
    }
    return (<h1>Failed to load activity</h1>)
  }

  return (
    <>
    <NavBar profile={profile} breadcrumbs={[{name: "\\", url: `/access`}, {name: course.name, url: `/access/course/${params.courseId}`}]}/>
    <div className="mt-4 ml-8 mr-8">
      <Slot children={getCurrentActivity()}/>
    </div>
  </>
  )
}