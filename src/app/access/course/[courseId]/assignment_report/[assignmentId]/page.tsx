"use server";

import NavBar from "~/components/ui/navbar";
import { Question } from "@prisma/client";
import { api } from "~/trpc/server";
import ActivityColumn from "./_components/ActivityColumn";
import PieChart from "./_components/PieChart";

export default async function Page({
  params,
}: {
  params: { courseId: string; assignmentId: string };
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
const activities = await api.activity.getMany.query({
  assignmentId: params.assignmentId,
});

// Sort the activities by their index
activities.sort((a, b) => a.index - b.index);

// For each activity, get the questions
let questions = Array<Array<Question>>();
for (let i = 0; i < activities.length; i++) {
  questions.push(
    await api.question.getMany.query({ activityId: activities[i]?.id! }),
  );
}

const formData = {
  courseId: params.courseId,
  assignment: assignment,
  activities: activities,
  questions: questions,
};


return (
  <>
    <NavBar
      profile={profile}
      breadcrumbs={[
        { name: "\\", url: `/access` },
        { name: course.name, url: `/access/course/${params.courseId}` },
        { name: assignment.name, url: ""}
      ]}
    />
    <div className="flex flex-col items-stretch justify-center px-5 py-11 pl-12 pr-12 max-md:px-5">

      <div className="w-full justify-center items-center flex flex-col pb-6">
        <h1 className="text-3xl text-center">Assignment Completion</h1>
        <PieChart/>
      </div>

      <div className="flex flex-col items-center justify-center">
        <ActivityColumn {...formData}/>
      </div>
    </div>
  </>
);
}
