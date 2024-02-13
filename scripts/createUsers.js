/*

This script creates users from a CSV file. The CSV file should have the following format:

Two columns: 
  (1) id, string
  (2) password, string

HOW TO USE:

```
node scripts/createUsers.js -c path/to/csvFile.csv
```

*/

const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')
const { ArgumentParser } = require('argparse')
const { PrismaClient, Role } = require('@prisma/client')

// Create Prisma client
const client = new PrismaClient()

require('dotenv').config()

// Parse arguments
const parser = new ArgumentParser({
  description: 'Create users from a CSV file'
})

parser.add_argument('-c', '--csvFilePath', { help: 'Path to the CSV file', type: "str", required: true })
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

async function createUser(email, password) {
  const {data, error} = await supabase.auth.admin.createUser({ 
    email: email, 
    password: password,
    email_confirm: true
  })
  if (error) {
    console.error('Error creating user: ' + email)
    return {email: email, id: null}
  }
   
  // Create profile
  const profile = await client.profile.upsert(
    {
      where: { id: data.user.id },
      update: { id: data.user.id, role: Role.STUDENT },
      create: { id: data.user.id, role: Role.STUDENT },
    }
  )

  // Push
  console.log('Creating user: ' + email)

  return {email: email, id: data.user.id}
}

function arrayToCsv(data){
  return data.map(row =>
    row
    .map(String)  // convert every value to String
    .map((v) => v.replaceAll('"', '""'))  // escape double quotes
    .map((v) => `"${v}"`)  // quote it
    .join(',')  // comma-separated
  ).join('\r\n');  // rows starting on new lines
}

function writeCsv(dataToWrite, filePath){
  fs.writeFile(filePath, dataToWrite, 'utf8', function (err) {
    if (err) {
      console.error(err);
    }
  });
}

const main = async () => {
  let resultingData = [['email', 'id']]
  
  let total = 0;
  let array = fs.readFileSync(csvFilePath).toString().split("\n");
  let asyncCalls = []

  for (let i = 0; i < array.length; i++) {

    let csvrow = array[i].split(",");

    // Check that header has two columns (id, password)
    if (total == 0) {
      if (csvrow.length != 2) {
        console.error('CSV file must have two columns: id, password')
        process.exit(1)
      }
      if (csvrow[0] != 'id' || csvrow[1] != 'password') {
        console.error('CSV file must have two columns: id, password')
        process.exit(1)
      }
      total++;
      continue;
    };

    // Construct email
    let name = csvrow[0].toString()
    if (name == "") {
      continue;
    }
    let email = name + 'study1@redforest.app'

    // Create user
    asyncCalls.push(createUser(email, csvrow[1]))
    total++;
  }

  const users = await Promise.all(
    asyncCalls
  )

  // Push to resulting data
  users.forEach(user => {
    resultingData.push([user.email, user.id])
  })

  console.log('Complete! Total users created: ' + users.length);

  // Save resulting data to CSV
  let csvData = arrayToCsv(resultingData)
  let timestamp = new Date().toISOString().replace(/:/g, '-')
  let newCsvFilePath = path.join(__dirname, `resultingData_${timestamp}.csv`)
  writeCsv(csvData, newCsvFilePath)

}

main()
  .then(async () => {
    await client.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await client.$disconnect()
    process.exit(1)
  })

