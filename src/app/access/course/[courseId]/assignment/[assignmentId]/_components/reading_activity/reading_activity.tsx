"use client";

import { useEffect, useState } from "react";
import { Course, Assignment, Activity, ActivityData, AssignmentData, ReadingFile, Question } from '@prisma/client'
import { api } from "~/trpc/react";

import EyeTrackingController from "./eye-tracking/eye-tracking-controller";
import GazeLogger from "./eye-tracking/gaze-logger"
import PDFViewer from './pdf-viewer';
import TaskDrawer from './task-drawer';
import Questions from "../question_activity/questions";
import ActivityCompletion from "../activity-completion"

type ReadingActivityProps = {
  course: Course
  assignment: Assignment
  activity: Activity
  activityData: ActivityData
  questions: Question[]
  assignmentData: AssignmentData
  ammountOfActivities: number
  currentActId: number
  setCurrentActId: (id: number) => void
}

export default function ReadingActivity(props: ReadingActivityProps) {

  const [ complete, setComplete ] = useState<boolean>(false);
  const [readingFiles, setReadingFiles] = useState<ReadingFile[]>([]);
  const readingActivityQuery = api.readingFile.getMany.useQuery({activityId: props.activity.id}, {enabled: false});

  useEffect(() => {
    const getReadingActivity = async () => {
      const result = await readingActivityQuery.refetch();

      if (result.error || !result.data) {
        console.log(result.error)
        return;
      }

      // Sort the files by their index
      result.data.sort((a, b) => a.index - b.index);

      setReadingFiles(result.data);

    };
    getReadingActivity();
  }, []);
  
  return (
    <>
      <div className="w-full flex justify-center items-center">
        <GazeLogger />
        <EyeTrackingController />
        <PDFViewer files={readingFiles}/>
        <TaskDrawer>
          <div className="mt-20 w-full">
          {!complete  
            ? <Questions {...props} complete={complete} setComplete={setComplete}/> 
            : <ActivityCompletion {...props} complete={complete}/>
          }
          </div>
        </TaskDrawer>
      </div>
    </>
  )
}