import { Profile, Assignment, Role, Course, AssignmentData } from "@prisma/client";

import NavBar from "~/components/ui/navbar";
import { api } from '~/trpc/server';
import AssignmentCard from "./_components/assignment-card";
import AssignmentCreate from './_components/assignment-create';

export default async function Page({params}: {params: { courseId: string }}) {

  // Default values
  let course: Course | null = null;
  let assignments: Assignment[] = [];
  let assignmentsDatas: AssignmentData[] = [];

  // Fetch data
  let profile: Profile = await api.auth.getProfile.query();
  try {
    course = await api.course.getOne.query({courseId: params.courseId, profileId: profile.id});
    assignments = await api.assignment.get.query({courseId: params.courseId});
  } catch (e) {
    console.log(e);
  }

  // Sort by due date
  assignments.sort((a, b) => {
    return a.dueDate.getTime() - b.dueDate.getTime();
  });

  // Remove any assignments that are not published (if they are student)
  if (profile.role == Role.STUDENT) {
    assignments = assignments.filter((assignment) => assignment.published);
    assignmentsDatas = await api.assignmentData.getMany.query({studentId: profile.id});

    // Order assignmentData to match the assignments order
    assignmentsDatas.sort((a, b) => {
      return assignments.findIndex((assignment) => assignment.id == a.assignmentId) - assignments.findIndex((assignment) => assignment.id == b.assignmentId);
    });
  }

  return (
    <div className="min-h-screen">
      <NavBar profile={profile} breadcrumbs={[{name: "\\", url: `/access`}]}/>
      <div className="container mx-auto pl-12 pr-12 bg-base-200 min-h-screen">
        {profile && course
          ? <div>
              <div>
                {assignments.map((assignment, index) => (
                  <>
                    {profile.role == Role.STUDENT
                      ? <AssignmentCard assignment={assignment} course={course!} editable={false} key={index} assignmentData={assignmentsDatas[index]}/>
                      : <AssignmentCard assignment={assignment} course={course!} editable={true} key={index}/>
                    }
                  </>
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
