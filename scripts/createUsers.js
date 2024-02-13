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
const { parse } = require('csv-parse');
const { createClient } = require('@supabase/supabase-js')
const { ArgumentParser } = require('argparse')

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
  return await supabase.auth.admin.createUser({ 
    email: email, 
    password: password,
    email_confirm: true
   })
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
    let email = csvrow[0].toString() + 'study1@redforest.app'
    console.log('Creating user: ' + email)

    // Create user
    const { data, error } = await createUser(email, csvrow[1])
    if (error) {
      console.error(error)
    }

    // Push
    resultingData.push([email, data.user.id])
    total++;
  }

  console.log('Complete! Total users created: ' + total);

  // Save resulting data to CSV
  let csvData = arrayToCsv(resultingData)
  let timestamp = new Date().toISOString().replace(/:/g, '-')
  let newCsvFilePath = path.join(__dirname, `resultingData_${timestamp}.csv`)
  writeCsv(csvData, newCsvFilePath)

}

main()

