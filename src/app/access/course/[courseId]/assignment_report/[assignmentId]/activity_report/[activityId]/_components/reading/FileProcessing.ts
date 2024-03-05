import * as dfd from 'danfojs'
import { ActivityData, Question } from "@prisma/client";
import { PerStudentData } from "./types";

type LogProcessingProps = {
  questions: Question[]
  perStudentDatas: {[key: string]: PerStudentData}
  activityDatas: ActivityData[]
  setPerStudentData: (perStudentData: any) => void
}

function getTimelineEvents(logs: {[key: string]: any}, activityData: ActivityData, questions: Question[]): {[key: string]: any} {
 
  // Results container
  const results: {[key: string]: any} = {};
  
  // Get the question answer times
  const actions: dfd.DataFrame = logs.actions;

  // Get reading start time
  const startReading = actions.query(actions['type'].eq('readingStart')).iloc({rows: [0]});
  results['readingStart'] = startReading['timestamp'].values[0]

  // Get question start time
  const startQuestion = actions.query(actions['type'].eq('questionStart')).iloc({rows: [0]});
  results['questionStart'] = startQuestion['timestamp'].values[0]

  // Get question submission information
  const questionLoad = actions.query(actions['type'].eq('questionLoad'));
  const questionSubmit = actions.query(actions['type'].eq('questionSubmit'));
  const numQuestions = logs.meta.questions;

  let accumulativeScore = 0;
  for (let i = 0; i < numQuestions.length; i++) {
    // console.log(questions[i])
    // console.log(activityData)
    let start = -1;
    let end = -1;
    let correct = 0;
    if (i == 0) {
      start = results['questionStart']
      end = questionSubmit['timestamp'].values[i]
      // correct = activityData.answers[i] == questions[i]?.answer ? questions[i]?.pts || 0 : 0
    }
    else {
      start = questionLoad['timestamp'].values[i-1]
      end = questionSubmit['timestamp'].values[i]
      // correct = activityData.answers[i] == questions[i]?.answer ? questions[i]?.pts || 0 : 0
    }
    accumulativeScore += correct
    results[`Q${i+1}`] = {
      start: start, 
      end: end,
      // correct: correct,
      // accumulativeScore: accumulativeScore
    }
  }

  return results
}

export default function LogProcessing(props: LogProcessingProps) {
  // Iterate through each student's data
  for (const studentId in props.perStudentDatas) {
    const studentData = props.perStudentDatas[studentId];
    const activityData = props.activityDatas.find((activityData) => activityData.id == studentId);
    const logs = studentData!.logs;
    const results = getTimelineEvents(logs, activityData!, props.questions!);

    // Update the dataStore
    for (const key in results) {
      if (results.hasOwnProperty(key)) {
        const result = results[key];
        // @ts-ignore
        studentData.dataStore[key] = result;
      }
    }
  }

  // Set the data
  props.setPerStudentData(props.perStudentDatas);
}