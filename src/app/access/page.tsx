import { Profile, Role, Course } from "@prisma/client";
import NavBar from "~/components/ui/navbar";
import CourseCard from "./_components/course-card";
import CourseCreate from "./_components/course-create";
import { api } from '~/trpc/server';

export default async function Dashboard() {
  
  // Fetch data
  let profile: Profile = await api.auth.getProfile.query();
  let courses: Course[] = await api.course.get.query({profileId: profile.id, role: profile.role});
  
  // Sort by course name
  courses.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      <NavBar profile={profile}/>
      <div className="container mx-auto p-12">
        {profile?.id
          ? <div>
              <div>
                {courses.map((course, index) => (
                  <CourseCard course={course} enableOptions={profile?.role == Role.TEACHER} key={index}/>
                ))}
              </div>
              {profile?.role == Role.TEACHER && <CourseCreate profile={profile}/>}
            </div>
          : <div>
              <p>Failed to fetch profile and course information</p>
            </div>
        }
      </div>
    </div>
  );
};
