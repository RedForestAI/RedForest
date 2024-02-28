"use server";

import { ActivityType } from "@prisma/client";
import NavBar from "~/components/ui/navbar";
import { api } from "~/trpc/server";
import Slot from "~/utils/slot";
import ReadingReport from "./_components/reading/ReadingReport";
import QuestionReport from "./_components/question/QuestionReport";

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

const getReport = async (activity: any) => {
  
  if (!activity)
    return <h1 className="text-error">Failed to load activity</h1>;
    
  switch (activity.type) {
    case ActivityType.READING:
      const readingActivity = await api.readingActivity.getOne.query({
        id: params.activityId,
      });
      const files = await api.readingFile.getMany.query({
        activityId: readingActivity!.id,
      });

      // Sorts the files by their index
      files.sort((a, b) => a.index - b.index);

      return <ReadingReport />;

    case ActivityType.QUESTIONING:
      return <QuestionReport />;

    default:
      return <h1 className="text-error">Failed to load activity</h1>;
  }
}

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
      <div className="ml-8 mr-8 mt-4">
        <Slot children={getReport(activity)} />
      </div>
    </div>
  </>
);
}
