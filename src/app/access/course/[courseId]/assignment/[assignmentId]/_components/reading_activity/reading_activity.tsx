"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Course, Assignment, Activity, ActivityData, AssignmentData, ActivityType, Question } from '@prisma/client'
import DynamicDocViewer from './dynamic-doc-viewer'
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { WebGazerManager } from '~/providers/WebGazerManager';

import "./pdf-viewer.css";

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

  const docs = [
    { uri: "https://arxiv.org/pdf/1708.08021.pdf" }, // Remote file
  ];

  useEffect(() => {
    const element = document.getElementById('pdf-controls');
    if (element) {
      element.remove();
    }
  }, []);
  
  return (
    <>
      <div className="w-full flex justify-center items-center">
        <DocViewer
          style={{ width: "70%", height: "70%" }}
          documents={docs} 
          pluginRenderers={DocViewerRenderers}
          config={{
            header: {
              overrideComponent: () => <div>Custom Header</div>,
              disableHeader: true,
              disableFileName: true,
              retainURLParams: true
            },
            pdfVerticalScrollByDefault: true
          }} 
        />
      </div>
    </>
  )
}