"use client";

import dynamic from "next/dynamic";
import { Course, Assignment, Activity, ActivityData, AssignmentData, ActivityType, Question } from '@prisma/client'
import DynamicDocViewer from './dynamic-doc-viewer'
import { WebGazerManager } from '~/providers/WebGazerManager';

type ReadingActivityProps = {
  course: Course
  assignment: Assignment
  activity: Activity
  activityData: ActivityData
  questions: Question[]
  assignmentData: AssignmentData
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
      {/* @ts-ignore */}
      <DynamicDocViewer url={pdfUrl}/>
    </>
  )
}