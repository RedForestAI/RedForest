/*

This script creates users from a CSV file. The CSV file should have the following format:

Two columns: 
  (1) id, string
  (2) password, string 

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

const main = async () => {
  let total = 0;
  fs.createReadStream(csvFilePath)
    .pipe(parse({delimiter: ','}))
    .on('data', async function(csvrow) {

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
      };

      // Construct email
      let email = csvrow[0].toString() + 'study1@redforest.app'
      console.log('Creating user: ' + email)

      // Create user
      const { data, error } = await createUser(email, csvrow[1])
      if (error) {
        console.error(error)
      }

      total++;   
    })
    .on('end',function() {
      console.log('Complete! Total users created: ' + total);
    });
};

main()

