import { get } from "http";
import { PerStudentData } from "./types";

type LogProcessingProps = {
  perStudentDatas: {[key: string]: PerStudentData};
  setPerStudentData: (perStudentData: any) => void
}

function getQuestionAnswerTimes(logs: any): {[key: string]: any} {
  // Get the question answer times
  console.log(logs.actions)
  return {}
}

export default function LogProcessing(props: LogProcessingProps) {

  // console.log(props)

  // Iterate through each student's data
  for (const studentId in props.perStudentDatas) {
    const studentData = props.perStudentDatas[studentId];
    const logs = studentData!.logs;

    const results = getQuestionAnswerTimes(logs);

    // Update the dataStore
    for (const key in results) {
      if (results.hasOwnProperty(key)) {
        const result = results[key];
        // @ts-ignore 
        studentData.dataStore[key] = result;
      }
    }

  }
}