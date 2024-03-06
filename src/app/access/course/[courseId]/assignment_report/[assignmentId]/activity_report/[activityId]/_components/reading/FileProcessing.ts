import { ActivityData, Question } from "@prisma/client";
import { PerStudentData } from "../types";

type LogProcessingProps = {
  questions: Question[]
  perStudentDatas: {[key: string]: PerStudentData}
  activityDatas: ActivityData[]
  setPerStudentData: (perStudentData: any) => void
}

function getTimelineEvents(logs: {[key: string]: any}): {[key: string]: any} {
 
  // Results container
  const results: {[key: string]: any} = {};
  
  // Get the question answer times
  const actions: any[][] = logs.actions; // [timestamp, type, JsonData]
 
  // Get the pdf times
  const pdfTimes: {[key: number]: {start: Date, end: Date}[]} = {};
  let currentPdfData: {start: Date, end: Date} = {start: new Date(), end: new Date()} 
  let currentPdf = -1; 

  for (const [index, row] of actions.entries()) {
   
    if (index == 0) continue;
    if (row[1] == 'readingStart') {
      results['readingStart'] = row[0];
    }
    else if (row[1] == 'questionStart') {
      results['questionStart'] = row[0];
      const readingStartDatetime = new Date(results['readingStart']);
      const questionStartDatetime = new Date(results['questionStart']);
      results['coldreadTime'] = (questionStartDatetime.getTime() - readingStartDatetime.getTime()) / 1000;
    }
    else if (row[1] == 'pdfLoad') {
      const rowData = JSON.parse(row[2]);
      const pdfIndex = Number(rowData['index'])

      if (pdfIndex != currentPdf) {
        if (currentPdf != -1) {

          // End prior
          currentPdfData['end'] = new Date(row[0]);
          if (currentPdf in pdfTimes) {
            // @ts-ignore
            pdfTimes[currentPdf].push(currentPdfData);
          }
          else {
            pdfTimes[currentPdf] = [currentPdfData];
          }

          // Start new
          currentPdfData = {start: new Date(row[0]), end: new Date()};
        } else {
          currentPdfData['start'] = new Date(row[0]);
        }
        currentPdf = pdfIndex;
      }
    }

    // Finished so add the last time
    if (index == actions.length - 1) {
      currentPdfData['end'] = new Date(row[0]);
      if (currentPdf in pdfTimes) {
        // @ts-ignore
        pdfTimes[currentPdf].push(currentPdfData);
      }
      else {
        pdfTimes[currentPdf] = [currentPdfData];
      }
    }
  }
    
  // Add to results
  results['pdfTimes'] = pdfTimes;
  return results
}

export default function LogProcessing(props: LogProcessingProps) {
  // Iterate through each student's data
  for (const studentId in props.perStudentDatas) {
    const studentData = props.perStudentDatas[studentId];
    const logs = studentData!.logs;
    const results = getTimelineEvents(logs);

    // Update the dataStore
    for (const key in results) {
      if (results.hasOwnProperty(key)) {
        const result = results[key];
        // @ts-ignore
        studentData.dataStore[key] = result;
      }
    }
  }

  console.log(props.perStudentDatas)

  // Set the data
  props.setPerStudentData(props.perStudentDatas);
}