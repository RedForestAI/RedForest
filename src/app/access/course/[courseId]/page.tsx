import { Profile, Assignment, Role, Course } from "@prisma/client";

import NavBar from "~/components/ui/navbar";
import { api } from '~/trpc/server';
import AssignmentCard from "./_components/assignment-card";
import AssignmentCreate from './_components/assignment-create';

export default async function Page({params}: {params: { courseId: string }}) {

  // Fetch data
  let profile: Profile = await api.auth.getProfile.query();
  let course: Course = await api.course.getOne.query({courseId: params.courseId, profileId: profile.id});
  let assignments: Assignment[] = await api.assignment.get.query({courseId: params.courseId});

  // Sort by due date
  assignments.sort((a, b) => {
    return a.dueDate.getTime() - b.dueDate.getTime();
  });

  console.log(assignments);

  return (
    <div>
      <NavBar includeBurger={true} accountLink={"/access/account"} logoLink={"/access"}/>
      <div className="container mx-auto p-4">
        {profile?.id
          ? <div>
              <div>
                {assignments.map((assignment, index) => (
                  <AssignmentCard assignment={assignment} course={course} key={index}/>
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
