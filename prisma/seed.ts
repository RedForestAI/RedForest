
import { PrismaClient, Role, Prisma, Profile, Course } from '@prisma/client'
const client = new PrismaClient()

const today = new Date();
let yesterday = new Date();
yesterday.setDate(today.getDate() - 1)
let tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1)


const getProfiles = (): Prisma.ProfileCreateInput[] => [
  { id: "00000000-0000-0000-0000-000000000001", role: Role.STUDENT },
  { id: "00000000-0000-0000-0000-000000000002", role: Role.STUDENT },
  { id: "00000000-0000-0000-0000-000000000003", role: Role.TEACHER },
];

const getCourses = (profiles: Profile[]): Prisma.CourseCreateInput[] => [
  {
    id: "10000000-0000-0000-0000-000000000000",
    name: "Course ID #1",
    teacher: { connect: { id: profiles[2]?.id }},
  },
  {
    id: "10000000-0000-0000-0000-000000000001",
    name: "Course ID #2",
    teacher: { connect: { id: profiles[2]?.id }},
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    name: "Course ID #3",
    teacher: { connect: { id: profiles[2]?.id }},
  }
];

const getCourseEnrollments = (profiles: Profile[], courses: Course[]): Prisma.courseEnrollmentCreateInput[] => [
  {
    id: "20000000-0000-0000-0000-000000000000",
    student: { connect: { id: profiles[0]?.id }},
    course: { connect: { id: courses[0]?.id }},
  },
  {
    id: "20000000-0000-0000-0000-000000000001",
    student: { connect: { id: profiles[1]?.id }},
    course: { connect: { id: courses[0]?.id }},
  },
  {
    id: "20000000-0000-0000-0000-000000000002",
    student: { connect: { id: profiles[0]?.id }},
    course: { connect: { id: courses[1]?.id }},
  },
  {
    id: "20000000-0000-0000-0000-000000000003",
    student: { connect: { id: profiles[1]?.id }},
    course: { connect: { id: courses[1]?.id }},
  },
  {
    id: "20000000-0000-0000-0000-000000000004",
    student: { connect: { id: profiles[0]?.id }},
    course: { connect: { id: courses[2]?.id }},
  },
  {
    id: "20000000-0000-0000-0000-000000000005",
    student: { connect: { id: profiles[1]?.id }},
    course: { connect: { id: courses[2]?.id }},
  },
];

const getAssignments = (courses: Course[]): Prisma.AssignmentCreateInput[] => [
  {
    id: "30000000-0000-0000-0000-000000000000",
    name: "Assignment ID #1",
    dueDate: yesterday,
    course: { connect: { id: courses[0]?.id }},
  },
  {
    id: "30000000-0000-0000-0000-000000000001",
    name: "Assignment ID #2",
    dueDate: today,
    course: { connect: { id: courses[0]?.id }},
  },
  {
    id: "30000000-0000-0000-0000-000000000002",
    name: "Assignment ID #3",
    dueDate: tomorrow,
    course: { connect: { id: courses[0]?.id }},
  },
  {
    id: "30000000-0000-0000-0000-000000000010",
    name: "Assignment ID #4",
    dueDate: yesterday,
    course: { connect: { id: courses[1]?.id }},
  },
  {
    id: "30000000-0000-0000-0000-000000000011",
    name: "Assignment ID #5",
    dueDate: today,
    course: { connect: { id: courses[1]?.id }},
  },
  {
    id: "30000000-0000-0000-0000-000000000012",
    name: "Assignment ID #6",
    dueDate: tomorrow,
    course: { connect: { id: courses[1]?.id }},
  },
  {
    id: "30000000-0000-0000-0000-000000000020",
    name: "Assignment ID #7",
    dueDate: yesterday,
    course: { connect: { id: courses[2]?.id }},
  },
  {
    id: "30000000-0000-0000-0000-000000000021",
    name: "Assignment ID #8",
    dueDate: today,
    course: { connect: { id: courses[2]?.id }},
  },
  {
    id: "30000000-0000-0000-0000-000000000022",
    name: "Assignment ID #9",
    dueDate: tomorrow,
    course: { connect: { id: courses[2]?.id }},
  },
]

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

  const assignments = await Promise.all(
    getAssignments(courses).map((assignment) => client.assignment.upsert(
      {
        where: { id: assignment.id },
        update: { ...assignment },
        create: { ...assignment },
      }))
  )

  console.log({ profiles, courses, courseEnrollments, assignments});
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
