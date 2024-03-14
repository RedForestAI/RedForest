import { Profile, Role, Course } from "@prisma/client";
import NavBar from "~/components/ui/NavBar";
import CourseCard from "./_components/CourseCard";
import CourseCreate from "./_components/CourseCreate";
import { api } from '~/trpc/server';
import { redirect } from "next/navigation";

export default async function Dashboard() {
  
  // Fetch data
  let profile: Profile | null = await api.auth.getProfile.query();
  if (!profile) {
    return redirect('/login');
  }
  let courses: Course[] = await api.course.get.query({profileId: profile.id, role: profile.role});
  
  // Sort by course name
  courses.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  return (
    <div>
      <NavBar profile={profile} breadcrumbs={[{name: "\\", url: ""}]}/>
      <div className="container mx-auto pl-12 pr-12">
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
