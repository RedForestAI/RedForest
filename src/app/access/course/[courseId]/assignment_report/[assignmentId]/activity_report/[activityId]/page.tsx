"use server";

import NavBar from "~/components/ui/navbar";
import { Question } from "@prisma/client";
import { api } from "~/trpc/server";

export default async function Page({
  params,
}: {
  params: { courseId: string; assignmentId: string, activityId: string };
}) {
// Queries
const profile = await api.auth.getProfile.query();
const course = await api.course.getOne.query({
  courseId: params.courseId,
  profileId: profile.id,
});
const assignment = await api.assignment.getOne.query({
  id: params.assignmentId,
});
const activity = await api.activity.getOne.query({
  id: params.activityId,
});

return (
  <>
    <NavBar
      profile={profile}
      breadcrumbs={[
        { name: "\\", url: `/access` },
        { name: course.name, url: `/access/course/${params.courseId}` },
        { name: assignment.name, url: `/access/course/${params.courseId}/assignment_report/${params.assignmentId}`},
        { name: activity?.name || "Activity Report", url: ''}
      ]}
    />
    <div className="items-stretch flex flex-col px-5 py-11 max-md:px-5 pl-12 pr-12">
      {/*Create a pretty coming soon page */}
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl">Coming Soon!</h1>
        <p className="text-xl">This page is still under construction</p>
      </div>
    </div>
  </>
);
}
