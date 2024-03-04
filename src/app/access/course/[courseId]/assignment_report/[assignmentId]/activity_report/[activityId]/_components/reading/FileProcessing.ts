import { PerStudentData } from "./types";

type LogProcessingProps = {
  perStudentDatas: PerStudentData[]
  setPerStudentData: (perStudentData: PerStudentData[]) => void
}

export default function LogProcessing(props: LogProcessingProps) {
  console.log(props);
}