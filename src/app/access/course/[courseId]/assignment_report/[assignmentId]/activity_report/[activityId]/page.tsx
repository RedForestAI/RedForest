"use server";

import { Profile, ActivityData, ActivityType } from "@prisma/client";
import NavBar from "~/components/ui/NavBar";
import { api } from "~/trpc/server";
import Slot from "~/utils/Slot";
import ReadingReport from "./_components/reading/ReadingReport";
import QuestionReport from "./_components/question/QuestionReport";
import * as d3 from 'd3';
import { colorMap } from "./_components/types";
import { redirect } from "next/navigation";

function generateColors(ids: string[]): colorMap {
  const colors = d3.schemeAccent;
  const newColorMap: colorMap = {};
  ids.forEach((id, index) => {
    // @ts-ignore
    newColorMap[id] = colors[index % colors.length];
  });
  return newColorMap;
}

export default async function Page({
  params,
}: {
  params: { courseId: string; assignmentId: string, activityId: string };
}) {

  // Queries
  const profile: Profile | null = await api.auth.getProfile.query();
  if (!profile) {
    return redirect("/login");
  }
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
  let activityDatas: ActivityData[] = [];

  // If student, only get their results
  if (profile.role === "STUDENT") {
    const activityData = await api.activityData.getOneByProfile.query({
      activityId: params.activityId,
      profileId: profile.id,
    });

    if (!activityData) {
      return <h1 className="text-error">Failed to load activity</h1>;
    }
    activityDatas = [activityData];
  } else {
    activityDatas = await api.activityData.getMany.query({
      activityId: params.activityId,
    });
  }

  // Sort based on profileId
  activityDatas.sort((a, b) => a.profileId.localeCompare(b.profileId));

  // Create colors for each student
  const ids = activityDatas.map((activityData) => activityData.profileId);
  const colors = generateColors(ids); 

  const questions = await api.question.getMany.query({
    activityId: params.activityId,
  });

  // Sort questions by index
  questions.sort((a, b) => a.index - b.index);

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
        let tracelogsFiles = await api.traceLogFile.getMany.query({
          activityId: params.activityId
        })
        
        // If student, filter the tracelogs to only show their own
        if (profile.role === "STUDENT") {
          tracelogsFiles = tracelogsFiles.filter((tracelog) => tracelog.profileId === profile.id);
        }
        
        // Sorts the files by their index
        files.sort((a, b) => a.index - b.index);

        const data = {
          activityDatas: activityDatas,
          activity: activity,
          readingFiles: files,
          questions: questions,
          tracelogs: tracelogsFiles,
          colors: colors
        }

        return <ReadingReport {...data}/>;

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
      <div className="items-stretch flex flex-col px-4 max-md:px-5 pl-4 pr-4">
        <Slot children={getReport(activity)} />
      </div>
    </>
  );
}
