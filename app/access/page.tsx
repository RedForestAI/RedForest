
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { Role, Course } from "@prisma/client";

import NavBar from "@/components/NavBar";
import CourseCard from "@/components/CourseCard";
import MyModal from "@/components/cruds/CourseCreate";

export default async function Dashboard() {
  
  // Fetch data
  const supabase = createClient()
  const { data } = await supabase.auth.getSession();

  // Determine role
  const profile = await prisma.profile.findUnique({
    where: {id: data.session?.user.id},
  });

  // Default values
  let courses: Course[] = [];

  if (profile?.role === Role.STUDENT) {
    
    // Get course enrollments
    const courseEnrollments = await prisma.courseEnrollment.findMany({
      where: {studentId: data.session?.user.id},
    });

    // Get course
    courses = await Promise.all(
      courseEnrollments.map(async (courseEnrollment) => prisma.course.findUniqueOrThrow({
        where: {id: courseEnrollment.courseId},
      }))
    );
  } else if (profile?.role === Role.TEACHER) {
      
    // Get courses
    courses = await prisma.course.findMany({
      where: {teacherId: data.session?.user.id},
    });
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
        {profile?.role == Role.TEACHER && <MyModal />}

      </div>
    </div>
  );
};
