"use server";

import { ActivityType } from "@prisma/client"
import Slot from "./_components/slot";
import ReadingForm from './_components/reading/reading-form';

import NavBar from "~/components/ui/navbar";
import { api } from '~/trpc/server';

export default async function Page({params}: {params: { courseId: string, assignmentId: string, activityId: string}}) {

  // Fetch the activity data
  const profile = await api.auth.getProfile.query();
  const course = await api.course.getOne.query({courseId: params.courseId, profileId: profile.id});
  const assignment = await api.assignment.getOne.query({id: params.assignmentId});
  const activity = await api.activity.getOne.query({id: params.activityId});
  const questions = await api.question.getMany.query({activityId: params.activityId})

  // Sorts the questions by their index
  questions.sort((a, b) => a.index - b.index)

  const getForm = async (activity: any) => {
    if (!activity) return <h1 className="text-error">Failed to load activity</h1>
    switch (activity.type) {
      case ActivityType.READING:
        const readingActivity = await api.readingActivity.getOne.query({id: params.activityId});
        const files = await api.readingFile.getMany.query({activityId: readingActivity!.id})

        // Sorts the files by their index
        files.sort((a, b) => a.index - b.index)

        const propData = {
          courseId: params.courseId,
          assignmentId: params.assignmentId,
          activity: activity,
          readingActivity: readingActivity,
          questions: questions,
          files: files
        }
        return <ReadingForm {...propData}/>
      default:
        return <h1 className="text-error">Failed to load activity</h1>
    }
  }

  return (
  <>
    <NavBar profile={profile} breadcrumbs={[{name: "\\", url: `/access`}, {name: course.name, url: `/access/course/${params.courseId}`}, {name: assignment.name, url: `/access/course/${params.courseId}/assignment_editor/${params.assignmentId}`}]}/>
    <div className="mt-4 ml-8 mr-8">
      <Slot children={getForm(activity)}/>
    </div>
  </>
)}