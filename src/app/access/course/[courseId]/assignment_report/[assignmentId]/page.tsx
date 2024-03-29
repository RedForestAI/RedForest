"use server";

import NavBar from "~/components/ui/NavBar";
import { Profile, Question, Role } from "@prisma/client";
import { api } from "~/trpc/server";
import ActivityColumn from "./_components/ActivityColumn";
import AssignmentCompletePieChart, { Datum } from "./_components/AssignmentCompletePie";
import { redirect } from "next/navigation";

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

let data: Datum[] = [];

if (profile.role == Role.TEACHER) {
  // Get the total number of students
  const courseEnrollments = await api.courseEnrollment.getMany.query({
    courseId: params.courseId,
  });
  const total = courseEnrollments.length;

  // Get the number of students who have completed the assignment
  const assignmentDatas = await api.assignmentData.getManyByAssignment.query({
    assignmentId: params.assignmentId,
  });
  const completed = assignmentDatas.filter((ad) => ad.completed).length;
  const started = assignmentDatas.length - completed;
  const yetToBegin = courseEnrollments.length - assignmentDatas.length;

  // Dummy data
  data = [
    { index: 0, label: "Completed", value: (completed/total)*100 },
    { index: 1, label: "Started", value: (started/total)*100 },
    { index: 2, label: "Yet to Begin", value: (yetToBegin/total)*100 },
  ];
}

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
    <div className="container flex flex-col items-stretch justify-center sm:max-w-[90vw] md:max-w-[60vw] pt-[5vh]">

      {profile.role == Role.TEACHER &&
        <div className="justify-center items-center flex flex-col pb-6" style={{height: "50vh"}}>
          <h1 className="text-3xl text-center">Assignment Completion</h1>
          <AssignmentCompletePieChart data={data}/>
        </div>
      }

      <div className="flex flex-col items-center justify-center">
        <ActivityColumn {...formData}/>
      </div>
    </div>
  </>
);
}
