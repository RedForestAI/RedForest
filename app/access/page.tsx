
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { Role, Course } from "@prisma/client";

import NavBar from "@/components/NavBar";
import CourseCard from "@/components/CourseCard";

export default async function Dashboard() {
  
  // Fetch data
  const supabase = createClient()
  const { data } = await supabase.auth.getSession();

  // Determine role
  const profile = await prisma.profile.findUnique({
    where: {id: data.session?.user.id},
  });
  console.log(profile)

  // Default values
  let courses: Course[] = [];

  if (profile?.role === Role.STUDENT) {
    
    // Get course enrollments
    const courseEnrollments = await prisma.courseEnrollment.findMany({
      where: {studentId: data.session?.user.id},
    });
    console.log(courseEnrollments)

    // Get course
    courses = await Promise.all(
      courseEnrollments.map(async (courseEnrollment) => prisma.course.findUniqueOrThrow({
        where: {id: courseEnrollment.courseId},
      })));
    console.log(courses)
  }

  return (
    <div>
      <NavBar includeBurger={true} accountLink={"access/account"} logoLink={"/access"}/>
      <div className="container mx-auto p-4">
        <div>
          {courses.map((course, index) => (
            <CourseCard course={course} enableOptions={profile?.role == Role.TEACHER} key={index}/>
          ))}
        </div>
      </div>
    </div>
  );
};
