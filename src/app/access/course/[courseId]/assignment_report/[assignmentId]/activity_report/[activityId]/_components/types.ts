export type Log = {
  name: string;
  contentType: string;
  data: any;
}

export type PerStudentData = {
  id: string;
  logs: {[key: string]: Log};
  dataStore?: {[key: string]: any}; // Processed data from logs
}

export type AnswerTrace = {
  index: number
  elapsedTime: number
  correct: Boolean
  pts: number
  accumulativeScore: number
}

export type colorMap = {[key: string]: string}