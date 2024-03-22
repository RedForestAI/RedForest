export type PerStudentData = {
  id: string;
  complete: boolean;
  logs: {[key: string]: any};
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