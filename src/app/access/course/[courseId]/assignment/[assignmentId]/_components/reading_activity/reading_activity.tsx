"use client";

import { useEffect, useState } from "react";
import { Profile, Course, Assignment, Activity, ActivityData, AssignmentData, ReadingFile, Question } from '@prisma/client';
import { api } from "~/trpc/react";

import EyeTrackingController from "~/eyetracking/eye-tracking-controller";
import PDFViewer from './pdf-viewer';
import TaskDrawer from './task-drawer';
import Questions from "../question_activity/questions";
import ActivityCompletion from "../activity-completion";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { generateUUID } from "~/utils/uuid";

import GazeLogger from "~/loggers/gaze-logger";
import ScrollLogger from "~/loggers/scroll-logger";
import ActionsLogger from "~/loggers/actions-logger";

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

export default function ReadingActivity(props: ReadingActivityProps) {

  const [ complete, setComplete ] = useState<boolean>(false);
  const [readingFiles, setReadingFiles] = useState<ReadingFile[]>([]);
  const readingActivityQuery = api.readingFile.getMany.useQuery({activityId: props.activity.id}, {enabled: false});
  const supabase = createClientComponentClient();
  const createTracelogFile = api.traceLogFile.create.useMutation()

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

  useEffect(() => {
    const uploadLogs = async () => {

      // Generate a session ID
      const session_id = generateUUID()
      const session_fp = `${props.activityData.id}/${props.profile.id}/${session_id}`

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