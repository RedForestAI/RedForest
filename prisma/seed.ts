
import { PrismaClient, Role, Prisma, Profile, Course } from '@prisma/client'
const client = new PrismaClient()

const getProfiles = (): Prisma.ProfileCreateInput[] => [
  { id: "00000000-0000-0000-0000-000000000001", role: Role.STUDENT },
  { id: "00000000-0000-0000-0000-000000000002", role: Role.STUDENT },
  { id: "00000000-0000-0000-0000-000000000003", role: Role.TEACHER },
];

const getCourses = (profiles: Profile[]): Prisma.CourseCreateInput[] => [
  {
    id: "10000000-0000-0000-0000-000000000000",
    name: "Course ID #1",
    // @ts-ignore
    teacher: { connect: { id: profiles[2].id }},
  },
  {
    id: "10000000-0000-0000-0000-000000000001",
    name: "Course ID #2",
    // @ts-ignore
    teacher: { connect: { id: profiles[2].id }},
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    name: "Course ID #3",
    // @ts-ignore
    teacher: { connect: { id: profiles[2].id }},
  }
];

const getCourseEnrollments = (profiles: Profile[], courses: Course[]): Prisma.courseEnrollmentCreateInput[] => [
  {
    id: "20000000-0000-0000-0000-000000000000",
    // @ts-ignore
    student: { connect: { id: profiles[0].id }},
    // @ts-ignore
    course: { connect: { id: courses[0].id }},
  },
  {
    id: "20000000-0000-0000-0000-000000000001",
    // @ts-ignore
    student: { connect: { id: profiles[1].id }},
    // @ts-ignore
    course: { connect: { id: courses[0].id }},
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    // @ts-ignore
    student: { connect: { id: profiles[0].id }},
    // @ts-ignore
    course: { connect: { id: courses[1].id }},
  },
  {
    id: "20000000-0000-0000-0000-000000000003",
    // @ts-ignore
    student: { connect: { id: profiles[1].id }},
    // @ts-ignore
    course: { connect: { id: courses[1].id }},
  },
  {
    id: "20000000-0000-0000-0000-000000000004",
    // @ts-ignore
    student: { connect: { id: profiles[0].id }},
    // @ts-ignore
    course: { connect: { id: courses[2].id }},
  },
  {
    id: "20000000-0000-0000-0000-000000000005",
    // @ts-ignore
    student: { connect: { id: profiles[1].id }},
    // @ts-ignore
    course: { connect: { id: courses[2].id }},
  },
];

const main = async () => {
  const profiles = await Promise.all(
    getProfiles().map((profile) => client.profile.upsert(
      {
        where: { id: profile.id },
        update: { ...profile },
        create: { ...profile },
      }
    ))
  );

  const courses = await Promise.all(
    getCourses(profiles).map((course) => client.course.upsert(
      {
        where: { id: course.id },
        update: { ...course },
        create: { ...course },
      }))
  )

  const courseEnrollments = await Promise.all(
    getCourseEnrollments(profiles, courses).map((courseEnrollment) => client.courseEnrollment.upsert(
      {
        where: { id: courseEnrollment.id },
        update: { ...courseEnrollment },
        create: { ...courseEnrollment },
      }))
  )

  console.log({ profiles, courses, courseEnrollments });
};

main()
  .then(async () => {
    await client.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await client.$disconnect()
    process.exit(1)
  })