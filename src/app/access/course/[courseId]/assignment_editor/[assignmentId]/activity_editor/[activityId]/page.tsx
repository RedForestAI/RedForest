"use server";

import { ActivityType } from "@prisma/client"
import Slot from "./_components/slot";
import ReadingForm from './_components/reading-form';

import NavBar from "~/components/ui/navbar";
import { api } from '~/trpc/server';

export default async function Page({params}: {params: { activityId: string}}) {
  console.log(params.activityId)

  // Fetch the activity data
  const profile = await api.auth.getProfile.query();
  const activity = await api.activity.getOne.query({id: params.activityId});

  const getForm = async (activity: any) => {
    switch (activity.type) {
      case ActivityType.READING:
        const readingActivity = await api.readingActivity.getOne.query({id: params.activityId});
        const propData = {
          activity: activity,
          readingActivity: readingActivity
        }
        return <ReadingForm {...propData}/>
      default:
        return <h1 className="text-error">Failed to load activity</h1>
    }
  
  }

  return (
  <>
    <NavBar profile={profile}/>
    <div className="mt-4 ml-8 mr-8">
      <Slot children={getForm(activity)}/>
    </div>
  </>
)}