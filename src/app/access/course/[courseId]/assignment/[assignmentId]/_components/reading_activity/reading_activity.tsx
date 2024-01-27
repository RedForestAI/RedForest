"use client";

import { useEffect } from "react";
import { Course, Assignment, Activity, ActivityData, AssignmentData, ActivityType, Question } from '@prisma/client'
import { WebGazerManager } from '~/providers/WebGazerManager';
import PDFViewer from './pdf-viewer';
import TaskDrawer from './task-drawer';
import QuestionActivity from "../question_activity/question_activity";

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

  const pdfUrl = 'https://arxiv.org/pdf/1708.08021.pdf'; // Replace with your PDF URL
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
  
  return (
    <>
      <div className="w-full flex justify-center items-center">
        <PDFViewer/>
        <TaskDrawer>
          <div className="mt-20 w-full">
            <QuestionActivity {...props}/>
          </div>
        </TaskDrawer>
      </div>
    </>
  )
}