/*

This script to bulk register users to a course. The CSV file should have the following format:

Two columns: 
  (1) email: string

HOW TO USE:

```
node scripts/registerUsersToCourse.js -c path/to/csvFile.csv
```

*/

const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse');
const { createClient } = require('@supabase/supabase-js')
const { ArgumentParser } = require('argparse')
const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

// Create Prisma client
const client = new PrismaClient()

// Parse arguments
const parser = new ArgumentParser({
  description: 'CSV file of Users to register to the course. The CSV file should have the following format:'
})

parser.add_argument('-c', '--csvFilePath', { help: 'Path to the CSV file', type: "str", required: true })
parser.add_argument('-i', '--courseId', { help: 'Course ID', type: "str", required: true })
let args = parser.parse_args()

// Convert relative to absolute path
csvFilePath = path.resolve(args.csvFilePath)

// Check if the file exists
if (!fs.existsSync(csvFilePath)) {
  console.error(`File not found: ${csvFilePath}`)
  process.exit(1)
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

const getCourseEnrollments = (profile_id, course_id) => [
  {
    id: generateUUID(),
    student: { connect: { id: profile_id }},
    course: { connect: { id: course_id }},
  },
];

const main = async () => {
  let total = 0;

  // First check that the course exists
  const course = await client.course.findUniqueOrThrow({
    where: { id: args.courseId }
  })

  let array = fs.readFileSync(csvFilePath).toString().split("\n");
  for (let i = 0; i < array.length; i++) {

    let csvrow = array[i].replaceAll('"', '').replaceAll('\r','').split(",");

    // Check that header has two columns (email, id)
    if (total == 0) {
      if (csvrow.length != 2) {
        console.error('CSV file must have two columns: email, id')
        process.exit(1)
      }
      if (csvrow[0] != 'email' || csvrow[1] != 'id') {
        console.error('CSV file must have two columns: email, id')
        process.exit(1)
      }
      total++;
      continue;
    };

    // Get the profile_id and course_id
    let profile_id = csvrow[1];

    // Create course enrollment
    const courseEnrollments = await Promise.all(
      getCourseEnrollments(profile_id, course.id).map((courseEnrollment) => client.courseEnrollment.upsert(
        {
          where: { id: courseEnrollment.id },
          update: { ...courseEnrollment },
          create: { ...courseEnrollment },
        }))
    )
    console.log(courseEnrollments)

    total++;
  }
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

