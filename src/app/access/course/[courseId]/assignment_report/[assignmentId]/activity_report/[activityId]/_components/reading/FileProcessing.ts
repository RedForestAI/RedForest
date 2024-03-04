import { PerStudentData } from "./types";

type LogProcessingProps = {
  perStudentDatas: {[key: string]: PerStudentData};
  setPerStudentData: (perStudentData: any) => void
}

function getQuestionAnswerTimes(logs: any) {
  // Get the question answer times

}

export default function LogProcessing(props: LogProcessingProps) {

  console.log(props)

  // Iterate through each student's data
  for (const studentId in props.perStudentDatas) {
    const studentData = props.perStudentDatas[studentId];
    const logs = studentData!.logs;

  }
}