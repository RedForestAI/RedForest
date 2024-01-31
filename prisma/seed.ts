// Load .env file
// import dotenv from 'dotenv'
// dotenv.config()

const fs = require('fs')
const path = require('path')

import { PrismaClient, Role, Prisma, Profile, Course, Assignment, Activity, ActivityType, Question, QuestionType, ReadingFile } from '@prisma/client'

// Create Supabase client
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const client = new PrismaClient()

const today = new Date();
let yesterday = new Date();
yesterday.setDate(today.getDate() - 1)
let tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1)

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}


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
    password: { create: { secret: "password1" }},
  },
  {
    id: "10000000-0000-0000-0000-000000000001",
    name: "Course ID #2",
    teacher: { connect: { id: profiles[2]?.id }},
    password: { create: { secret: "password2" }},
  },
  {
    id: "10000000-0000-0000-0000-000000000002",
    name: "Course ID #3",
    teacher: { connect: { id: profiles[2]?.id }},
    password: { create: { secret: "password3" }},
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
    published: true,
    publishedDate: yesterday,
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
    published: true,
    publishedDate: yesterday,
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
    published: true,
    publishedDate: yesterday,
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

const getActivities = (assignments: Assignment[]): Prisma.ActivityCreateInput[] => {
  let activities = []
  for (let i = 0; i < assignments.length; i++) {
    // activities.push(
    //   {
    //     id: generateUUID(),
    //     index: 0,
    //     name: "Pretest",
    //     description: `Pretest description`,
    //     type: ActivityType.QUESTIONING,
    //     assignment: { connect: { id: assignments[i]?.id }},
    //   }
    // )
    activities.push(
      {
        id: generateUUID(),
        index: 1,
        name: `Activity`,
        description: `Activity Description`,
        type: ActivityType.READING,
        assignment: { connect: { id: assignments[i]?.id }},
      }
    )
    // activities.push(
    //   {
    //     id: generateUUID(),
    //     index: 2,
    //     name: `Posttest`,
    //     description: `Posttest description`,
    //     type: ActivityType.QUESTIONING,
    //     assignment: { connect: { id: assignments[i]?.id }},
    //   }
    // )
  }
  return activities
}

const uploadFiles = async (activities: Activity[]) => {

  const dummyFilePath = path.join(__dirname, "tests/dummy.pdf")
  const sampleFilePath = path.join(__dirname, "tests/sample.pdf")
  const dummy = fs.readFileSync(dummyFilePath)
  const sample = fs.readFileSync(sampleFilePath)

  let filepaths: string[][] = []
  for (let i = 0; i < activities.length; i++) {
    if (activities[i]?.type !== ActivityType.READING) continue
    // Load local PDF file
    const new_path = `tests/dummy${i}.pdf`
    const new_path2 = `tests/sample${i}.pdf`

    // Let's actually upload a file within the seed, to supabase
    const data = await supabase.storage.from("activity_reading_file").upload(new_path, dummy, {
      contentType: "application/pdf",
    })
    const data2 = await supabase.storage.from("activity_reading_file").upload(new_path2, sample, {
      contentType: "application/pdf",
    })
    console.log({data, data2})

    filepaths.push([new_path, new_path2])
  }

  return filepaths
}

const getReadingFiles = (activities: Activity[], filepaths: string[][]): Prisma.ReadingFileCreateInput[] => {
  let readingFiles = []
  let j = 0;
  for (let i = 0; i < activities.length; i++) {
    if (activities[i]?.type !== ActivityType.READING) continue
    
    const filepath = filepaths[j]
    j++

    for (let k = 0; k < filepath!.length; k++) {
      readingFiles.push(
        {
          id: generateUUID(),
          title: `Reading File ${k}`,
          filepath: filepath![k]!,
          size: 100,
          index: k,
          activity: { connect: { id: activities[i]?.id }},
        }
      )
    }
  }
  return readingFiles
}

const getReadingActivities = (activities: Activity[]): Prisma.ReadingActivityCreateInput[] => {
  let rActivities = []
  for (let i = 0; i < activities.length; i++) {
    if (activities[i]?.type !== ActivityType.READING) continue
    if (activities[i]){
      rActivities.push(
        {
          id: activities[i]!.id,
        }
      )
    }
  }
  return rActivities
}

const getQuestions = (activities: Activity[]): Prisma.QuestionCreateInput[] => {
  let questions: Prisma.QuestionCreateInput[] = []
  for (let i = 0; i < activities.length; i++) {
    if (activities[i]) {
      questions.push({
        id: generateUUID(),
        content: 'What is the answer to this question?',
        options: ['A', 'B', 'C', 'D'],
        type: QuestionType.MULTIPLE_CHOICE,
        answer: 0,
        index: 0,
        pts: 2,
        activity: { connect: { id: activities[i]?.id }},
      });

      // questions.push({
      //   id: generateUUID(),
      //   content: '2 What is the answer to this question?',
      //   options: ['A2', 'B2', 'C2', 'D2'],
      //   type: QuestionType.MULTIPLE_CHOICE,
      //   answer: 0,
      //   index: 1,
      //   pts: 2,
      //   activity: { connect: { id: activities[i]?.id }},
      // });

      // questions.push({
      //   id: generateUUID(),
      //   content: '3 What is the answer to this question?',
      //   options: ['A3', 'B3', 'C3', 'D3'],
      //   type: QuestionType.MULTIPLE_CHOICE,
      //   answer: 0,
      //   index: 2,
      //   pts: 2,
      //   activity: { connect: { id: activities[i]?.id }},
      // });

      // questions.push({
      //   id: generateUUID(),
      //   content: '4 What is the answer to this question?',
      //   options: ['A4', 'B4', 'C4', 'D4'],
      //   type: QuestionType.MULTIPLE_CHOICE,
      //   answer: 0,
      //   index: 3,
      //   pts: 2,
      //   activity: { connect: { id: activities[i]?.id }},
      // });
    }
  }
  return questions;
}

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

  const activities = await Promise.all(
    getActivities(assignments).map((activity) => client.activity.upsert(
      {
        where: { id: activity.id },
        update: { ...activity },
        create: { ...activity },
      }))
  )

  const readingActivities = await Promise.all(
    getReadingActivities(activities).map((readingActivity) => client.readingActivity.upsert(
      {
        where: { id: readingActivity.id },
        update: { ...readingActivity },
        create: { ...readingActivity },
      }
      ))
  )

  const filepaths = await uploadFiles(activities)

  const readingFiles = await Promise.all(
    getReadingFiles(activities, filepaths).map((readingFile) => client.readingFile.upsert(
      {
        where: { id: readingFile.id },
        update: { ...readingFile },
        create: { ...readingFile },
      }))
  )

  const questions = await Promise.all(
    getQuestions(activities).map((question) => client.question.upsert(
      {
        where: { id: question.id },
        update: { ...question },
        create: { ...question },
      }
      ))
  )

  console.log(profiles)
  console.log(courses)
  console.log(courseEnrollments)
  console.log(assignments)
  console.log(activities)
  console.log(readingActivities)
  console.log(questions)
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
