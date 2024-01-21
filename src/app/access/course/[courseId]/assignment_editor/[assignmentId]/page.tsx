"use server";

import NavBar from "~/components/ui/navbar";
import AssignmentForm from "./_components/assignment-form";

import { api } from "~/trpc/server";

export default async function Page({params}: {params: { courseId: string, assignmentId: string }}) {
  
  // Queries
  const profile = await api.auth.getProfile.query();
  const assignment = await api.assignment.getOne.query({id: params.assignmentId});
  const activities = await api.activity.getMany.query({assignmentId: params.assignmentId})

  // Sort the activities by their index
  activities.sort((a, b) => a.index - b.index)

  const formData = {
    courseId: params.courseId,
    assignment: assignment,
    activities: activities
  }

  return (
    <div>
      <NavBar profile={profile}/>
      <div className="items-stretch flex flex-col px-5 py-11 max-md:px-5 pl-12 pr-12">
        <AssignmentForm {...formData}/>
      </div>
    </div>
  )
};
