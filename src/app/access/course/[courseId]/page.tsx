import { Profile, Assignment, Role, Course, AssignmentData } from "@prisma/client";

import NavBar from "~/components/ui/navbar";
import { api } from '~/trpc/server';
import AssignmentCard from "./_components/assignment-card";
import AssignmentCreate from './_components/assignment-create';
import { redirect } from "next/navigation";

export default async function Page({params}: {params: { courseId: string }}) {

  // Default values
  let course: Course | null = null;
  let assignments: Assignment[] = [];
  let assignmentsDatas: AssignmentData[] = [];

  // Fetch data
  let profile: Profile | null = await api.auth.getProfile.query();
  if (!profile) {
    return redirect('/login');
  }

  try {
    course = await api.course.getOne.query({courseId: params.courseId, profileId: profile.id});
    assignments = await api.assignment.get.query({courseId: params.courseId});
  } catch (e) {
    console.error(e);
  }

  // Sort by due date
  assignments.sort((a, b) => {
    return a.dueDate.getTime() - b.dueDate.getTime();
  });

  // Remove any assignments that are not published (if they are student)
  if (profile.role == Role.STUDENT) {
    assignments = assignments.filter((assignment) => assignment.published);
    assignmentsDatas = await api.assignmentData.getMany.query({studentId: profile.id});
  }

  const getAssignmentData = (assignmentId: string) => {
    return assignmentsDatas.find((assignmentData) => assignmentData.assignmentId == assignmentId);
  }

  return (
    <div>
      <NavBar profile={profile} breadcrumbs={[{name: "\\", url: `/access`}, {name: course?.name || "", url: ""}]}/>
      <div className="container mx-auto pl-12 pr-12">
        {profile && course
          ? <div>
              <div>
                {assignments.map((assignment, index) => (
                  <div key={index}>
                    {profile?.role == Role.STUDENT
                      ? <AssignmentCard assignment={assignment} course={course!} editable={false} assignmentData={getAssignmentData(assignment.id)}/>
                      : <AssignmentCard assignment={assignment} course={course!} editable={true}/>
                    }
                  </div>
                ))}
              </div>
              {profile?.role == Role.TEACHER && <AssignmentCreate profile={profile} course={course}/>}
            </div>
          : <div>
              <p>Failed to fetch profile and course information</p>
            </div>
        }
      </div>
    </div>
  )
};
