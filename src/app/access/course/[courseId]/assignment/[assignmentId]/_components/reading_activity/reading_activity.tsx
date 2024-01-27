"use client";

import { useEffect, useState } from "react";
import { Course, Assignment, Activity, ActivityData, AssignmentData, ReadingFile, Question } from '@prisma/client'
import { WebGazerManager } from '~/providers/WebGazerManager';
import PDFViewer from './pdf-viewer';
import TaskDrawer from './task-drawer';
import QuestionActivity from "../question_activity/question_activity";
import { api } from "~/trpc/react";

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

  const [readingFiles, setReadingFiles] = useState<ReadingFile[]>([]);
  const readingActivityQuery = api.readingFile.getMany.useQuery({activityId: props.activity.id}, {enabled: false});
  let webGazer = new WebGazerManager();

  const handleStart = () => {
    webGazer.start();
  };
  
  const handleHide = () => {
    webGazer.hide();
  };
  
  const handleShow = () => {
    webGazer.show();
  };

  const handleStop = () => {
    webGazer.stop();
  };
  
  const handleEnd = () => {
    webGazer.end();
    webGazer = new WebGazerManager();
  };

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
        <PDFViewer files={readingFiles}/>
        <TaskDrawer>
          <div className="mt-20 w-full">
            <QuestionActivity {...props}/>
          </div>
        </TaskDrawer>
      </div>
    </>
  )
}