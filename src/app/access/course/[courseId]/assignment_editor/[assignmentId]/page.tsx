"use server";

import { Profile, Question } from "@prisma/client";
import NavBar from "~/components/ui/NavBar";
import AssignmentForm from "./_components/AssignmentForm";
import { redirect } from "next/navigation";

import { api } from "~/trpc/server";

export default async function Page({
  params,
}: {
  params: { courseId: string; assignmentId: string };
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
          { name: "Assignment Editor", url: ""}
        ]}
      />
      <div className="flex flex-col items-stretch px-5 py-11 pl-12 pr-12 max-md:px-5">
        <AssignmentForm {...formData} />
      </div>
    </>
  );
}
