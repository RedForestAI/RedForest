import { Profile, Role, Course } from "@prisma/client";
import NavBar from "~/components/ui/navbar";
import CourseCard from "~/components/ui/course-card";
import CourseCreate from "~/components/Modals/course-create";
import { api } from '~/trpc/server';

export default async function Dashboard() {
  
  // Fetch data
  let profile: Profile = await api.auth.getProfile.query();
  let courses: Course[] = await api.course.get.query({profileId: profile.id, role: profile.role});

  return (
    <div>
      <NavBar includeBurger={true} accountLink={"/access/account"} logoLink={"/access"}/>
      <div className="container mx-auto p-4">
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
