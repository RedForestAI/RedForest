"use client";

import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { generateUUID } from "~/utils/uuid";
import { IDocument } from "@cyntler/react-doc-viewer";

import { Profile, Course, Assignment, Activity, ActivityData, AssignmentData, ReadingFile, Question, Highlight, Annotation } from '@prisma/client';
import { api } from "~/trpc/react";

import EyeTrackingController from "~/eyetracking/eye-tracking-controller";
import PDFViewer from '../reading_activity/pdf-viewer';
import { AOIEncoding } from "~/eyetracking/aoi-encoding";
import { triggerActionLog } from "~/loggers/actions-logger";
import InstructionsModal from "./instructions-modal";
import { Linear, Skimming } from "./behaviors";

import GazeLogger from "~/loggers/gaze-logger";
import ScrollLogger from "~/loggers/scroll-logger";
import ActionsLogger from "~/loggers/actions-logger";

type BehaviorConfig = {
  name: "LINEAR" | "SKIMMING" | "DEEP" | "REGULAR" | "SHALLOW" | "SKIPPING" | "REREAD"
  component: React.ReactElement
}

type ReadingActivityProps = {
  profile: Profile
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

// Loggers
const gazeLogger = new GazeLogger();
const scrollLogger = new ScrollLogger();
const actionsLogger = new ActionsLogger()

export default function BehaviorReadingActivity(props: ReadingActivityProps) {

  const [ complete, setComplete ] = useState<boolean>(false);
  const [ readingFiles, setReadingFiles ] = useState<ReadingFile[]>([]);
  const [ activeDocument, setActiveDocument ] = useState<IDocument>();
  const [ docs, setDocs ] = useState<{ uri: string }[]>([{ uri: "/pdfs/behavior_mummy.pdf"}]);
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false)
  const [ inInstructions, setInInstructions ] = useState<boolean>(false)
  const [ behaviorIndex, setBehaviorIndex ] = useState<number>(1)
  
  const createTracelogFile = api.traceLogFile.create.useMutation()
  const supabase = createClientComponentClient();

  // Configuration
  const config: BehaviorConfig[] = [
    {
      name: "LINEAR",
      component: <Linear behaviorIndex={behaviorIndex} setBehaviorIndex={setBehaviorIndex}/>
    },
    {
      name: "SKIMMING",
      component: <Skimming behaviorIndex={behaviorIndex} setBehaviorIndex={setBehaviorIndex}/>
    },
  ]

  useEffect(() => {
    // Clear logs
    gazeLogger.clear()
    scrollLogger.clear()
    actionsLogger.clear()
  }, []);

  // Debugging
  useEffect(() => {
    // Define the click event handler function
    const aoiEncoding = (e: any) => {
      const aoi = AOIEncoding(e.detail.x, e.detail.y)

      // Create the event data
      let data = {}
      if (aoi != null) {
        data = {
          t: e.detail.t,
          x: e.detail.x,
          y: e.detail.y,
          aoiType: aoi.aoiType,
          aoiInfo: aoi.aoiInfo,
          rX: aoi.rX,
          rY: aoi.rY,
        }
      } else {
        data = {
          t: e.detail.t,
          x: e.detail.x,
          y: e.detail.y,
          aoiType: "",
          aoiInfo: "",
          rX: 0,
          rY: 0,
        }
      }
      const event = new CustomEvent("processedGazeUpdate", { detail: data });
      
      // Dispatch the event on the document
      document.dispatchEvent(event);
    };

    // Attach the event listener to the window object
    document.addEventListener('gazeUpdate', aoiEncoding);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('gazeUpdate', aoiEncoding);
    };
  }, []); // Empty dependency array means this effect runs only once after the initial render

  useEffect(() => {
    const uploadLogs = async () => {
      if (isSubmitting) return;
      setIsSubmitting(true)

      // Generate a session ID
      const session_id = generateUUID()
      const session_fp = `course_${props.course.id}/assignment_${props.assignment.id}/activity_${props.activity.id}/profile_${props.profile.id}/session_${session_id}`

      // Create a path
      try {
        // Gaze
        const gaze_file = gazeLogger.getBlob()
        const gaze_filepath = `${session_fp}/gaze.csv`
        const gaze_result = await createTracelogFile.mutateAsync({activityDataId: props.activityData.id, filepath: gaze_filepath})
        const gaze_storage_result = await supabase.storage.from('tracelogs').upload(gaze_filepath, gaze_file);

        if (gaze_storage_result.error) {
          console.error("Failed to upload gaze data")
        }

        // Scroll
        const scroll_file = scrollLogger.getBlob()
        const scroll_filepath = `${session_fp}/scroll.csv`
        const scroll_result = await createTracelogFile.mutateAsync({activityDataId: props.activityData.id, filepath: scroll_filepath})
        const scroll_storage_result = await supabase.storage.from('tracelogs').upload(scroll_filepath, scroll_file);

        if (scroll_storage_result.error) {
          console.error("Failed to upload scroll data")
        }

        // Actions (QA & PDF)
        const actions_file = actionsLogger.getBlob()
        const actions_filepath = `${session_fp}/actions.csv`
        const actions_result = await createTracelogFile.mutateAsync({activityDataId: props.activityData.id, filepath: actions_filepath})
        const actions_storage_result = await supabase.storage.from('tracelogs').upload(actions_filepath, actions_file);

        if (actions_storage_result.error){
          console.error("Failed to upload actions data")
        }

        // Meta data
        const meta_file = new Blob([JSON.stringify({
          tracelog_date_uploaded: new Date().toISOString(),
          session_id: session_id, 
          course_id: props.course.id, 
          assignment_id: props.assignment.id,
          assignment_data_id: props.assignmentData.id,
          activity_id: props.activity.id, 
          activity_data_id: props.activityData.id,
          profile_id: props.profile.id,
          activityType: "reading",
          totalQuestions: props.questions.length,
          totalFiles: readingFiles.length,
        })], { type: "application/json;charset=utf-8"})
        const meta_filepath = `${session_fp}/meta.json`
        const meta_result = await createTracelogFile.mutateAsync({activityDataId: props.activityData.id, filepath: meta_filepath})
        const meta_storage_result = await supabase.storage.from('tracelogs').upload(meta_filepath, meta_file);

        setIsSubmitting(false)

        if (meta_storage_result.error){
          console.error("Failed to upload meta data")
        }

      } catch (error) {
        console.error("Failed to upload tracelogs")
      }
    }

    if (complete) {
      uploadLogs()
    }
  }, [complete])

  return (
    <>
      <div className="w-full flex justify-center items-center">
        <EyeTrackingController complete={complete}/>

        {inInstructions &&
          <InstructionsModal setInInstructions={setInInstructions}/>
        }
        
        <PDFViewer 
          docs={docs}
          files={readingFiles}
          config={{
            btnLayer: !inInstructions,
            component: config[behaviorIndex]!.component,
          }}
          activityDataId={props.activityData.id}

          activeDocument={activeDocument!}
          setActiveDocument={setActiveDocument}
        />
      </div>
    </>
  )
}