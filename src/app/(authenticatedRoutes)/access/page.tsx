
import { db } from "~/server/db";
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Role, Course } from "@prisma/client";

import NavBar from "~/components/ui/navbar";
import CourseCard from "~/components/ui/course-card";
import CourseCreate from "~/components/Modals/course-create";

export default async function Dashboard() {
  
  // Fetch data
  const cookieStore = cookies()
  const supabase = createServerComponentClient({ cookies: () => cookieStore })
  const { data } = await supabase.auth.getUser();
  let profile = {id: 0, role: Role.STUDENT};

  console.log(data);

  // Determine role
  try{
    profile = await db.profile.findUnique({
      where: {id: data.user?.id},
    });
  } catch (e) {
    console.log(e);
  }

  console.log(profile);

  // Default values
  let courses: Course[] = [];

  if (profile?.role === Role.STUDENT) {
    
    // Get course enrollments
    const courseEnrollments = await db.courseEnrollment.findMany({
      where: {studentId: data.user?.id},
    });

    // Get course
    courses = await Promise.all(
      courseEnrollments.map(async (courseEnrollment) => db.course.findUniqueOrThrow({
        where: {id: courseEnrollment.courseId},
      }))
    );
  } else if (profile?.role === Role.TEACHER) {
      
    // Get courses
    courses = await db.course.findMany({
      where: {teacherId: data.user?.id},
    });
  }

  return (
    <div>
      <NavBar includeBurger={true} accountLink={"/account"} logoLink={"/access"}/>
      <div className="container mx-auto p-4">
        <div>
          {courses.map((course, index) => (
            <CourseCard course={course} enableOptions={profile?.role == Role.TEACHER} key={index}/>
          ))}
        </div>
        {profile?.role == Role.TEACHER && <CourseCreate />}
      </div>
    </div>
  );
};
