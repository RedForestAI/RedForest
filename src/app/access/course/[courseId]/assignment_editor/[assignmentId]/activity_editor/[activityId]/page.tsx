"use server";

import { Profile, ActivityType } from "@prisma/client";
import Slot from "~/utils/Slot";
import ReadingForm from "./_components/reading/ReadingForm";
import QuestionForm from "./_components/questioning/QuestionForm";
import ReadingBehaviorForm from "./_components/reading_behavior/ReadingBehaviorForm";
import { redirect } from "next/navigation";

import NavBar from "~/components/ui/NavBar";
import { api } from "~/trpc/server";

export default async function Page({
  params,
}: {
  params: { courseId: string; assignmentId: string; activityId: string };
}) {
  // Fetch the activity data
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
  const activity = await api.activity.getOne.query({ id: params.activityId });
  const questions = await api.question.getMany.query({
    activityId: params.activityId,
  });

  // Sorts the questions by their index
  questions.sort((a, b) => a.index - b.index);

  const getForm = async (activity: any) => {
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

        let readingPropData = {
          courseId: params.courseId,
          assignmentId: params.assignmentId,
          activity: activity,
          readingActivity: readingActivity,
          questions: questions,
          files: files,
        };
        return <ReadingForm {...readingPropData} />;

      case ActivityType.QUESTIONING:
        let questionPropData = {
          courseId: params.courseId,
          assignmentId: params.assignmentId,
          activity: activity,
          questions: questions,
        };
        return <QuestionForm {...questionPropData} />;

      case ActivityType.READING_BEHAVIOR:
        let readingBehaviorPropData = {
          courseId: params.courseId,
          assignmentId: params.assignmentId,
          activity: activity,
        };

        return <ReadingBehaviorForm {...readingBehaviorPropData} />;

      default:
        return <h1 className="text-error">Failed to load activity</h1>;
    }
  };

  return (
    <>
      <NavBar
        profile={profile}
        breadcrumbs={[
          { name: "\\", url: `/access` },
          { name: course.name, url: `/access/course/${params.courseId}` },
          {
            name: assignment.name,
            url: `/access/course/${params.courseId}/assignment_editor/${params.assignmentId}`,
          },
          { name: "Activity Editor", url: "" }
        ]}
      />
      <div className="ml-8 mr-8 mt-4">
        <Slot children={getForm(activity)} />
      </div>
    </>
  );
}
