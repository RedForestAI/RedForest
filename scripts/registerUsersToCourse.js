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
const { PrismaClient, Role, Prisma, Profile, Course, Assignment, Activity, ActivityType, Question, QuestionType, ReadingFile } = require('@prisma/client')
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

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const main = async () => {
  let total = 0;
  fs.createReadStream(csvFilePath)
    .pipe(parse({delimiter: ','}))
    .on('data', async function(csvrow) {

      // Check that header has two columns (id, password)
      if (total == 0) {
        if (csvrow.length != 1) {
          console.error('CSV file must have 1 column: email')
          process.exit(1)
        }
      };

      // Get the ID of the user
      let email = csvrow[0];
      

      total++;   
    })
    .on('end',function() {
      console.log('Complete! Total users created: ' + total);
    });
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

