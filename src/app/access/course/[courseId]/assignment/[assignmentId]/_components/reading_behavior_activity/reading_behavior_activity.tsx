"use client";

import React, { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { generateUUID } from "~/utils/uuid";
import { IDocument } from "@cyntler/react-doc-viewer";

import {
  Profile,
  Course,
  Assignment,
  Activity,
  ActivityData,
  AssignmentData,
  ReadingFile,
  Question,
} from "@prisma/client";
import { api } from "~/trpc/react";

import EyeTrackingController from "~/eyetracking/eye-tracking-controller";
import PDFViewer from "../reading_activity/pdf-viewer";
import { AOIEncoding } from "~/eyetracking/aoi-encoding";
import InstructionsModal from "./instructions-modal";
import {
  Linear,
  Skimming,
  Deep,
  Shallow,
  Regular,
  Skipping,
  ReReading,
} from "./behaviors";
import ActivityCompletion from "../activity-completion";

import GazeLogger from "~/loggers/gaze-logger";
import ScrollLogger from "~/loggers/scroll-logger";
import ActionsLogger from "~/loggers/actions-logger";
import MouseLogger from "~/loggers/mouse-logger";

type BehaviorConfig = {
  name:
    | "LINEAR"
    | "SKIMMING"
    | "DEEP"
    | "REGULAR"
    | "SHALLOW"
    | "SKIPPING"
    | "REREAD";
  component: React.ReactElement;
};

type ReadingActivityProps = {
  profile: Profile;
  course: Course;
  assignment: Assignment;
  activity: Activity;
  activityData: ActivityData;
  questions: Question[];
  assignmentData: AssignmentData;
  ammountOfActivities: number;
  currentActId: number;
  setCurrentActId: (id: number) => void;
};

// Loggers
const gazeLogger = new GazeLogger();
const scrollLogger = new ScrollLogger();
const actionsLogger = new ActionsLogger();
const mouseLogger = new MouseLogger();

export default function BehaviorReadingActivity(props: ReadingActivityProps) {
  const [complete, setComplete] = useState<boolean>(false);
  const [readingFiles, setReadingFiles] = useState<ReadingFile[]>([]);
  const [activeDocument, setActiveDocument] = useState<IDocument>();
  const [docs, setDocs] = useState<{ uri: string }[]>([
    { uri: "/pdfs/behavior_mummy.pdf" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [inInstructions, setInInstructions] = useState<boolean>(true);
  const [behaviorIndex, setBehaviorIndex] = useState<number>(0);
  const [runningET, setRunningET] = useState<boolean>(false);

  const createTracelogFile = api.traceLogFile.create.useMutation();
  const supabase = createClientComponentClient();

  // Configuration
  const config: BehaviorConfig[] = [
    {
      name: "LINEAR",
      component: (
        <Linear
          behaviorIndex={behaviorIndex}
          setBehaviorIndex={setBehaviorIndex}
          totalBehaviors={7}
          setComplete={setComplete}
        />
      ),
    },
    {
      name: "SKIMMING",
      component: (
        <Skimming
          behaviorIndex={behaviorIndex}
          setBehaviorIndex={setBehaviorIndex}
          totalBehaviors={7}
          setComplete={setComplete}
        />
      ),
    },
    {
      name: "DEEP",
      component: (
        <Deep
          behaviorIndex={behaviorIndex}
          setBehaviorIndex={setBehaviorIndex}
          totalBehaviors={7}
          setComplete={setComplete}
        />
      ),
    },
    {
      name: "SHALLOW",
      component: (
        <Shallow
          behaviorIndex={behaviorIndex}
          setBehaviorIndex={setBehaviorIndex}
          totalBehaviors={7}
          setComplete={setComplete}
        />
      ),
    },
    {
      name: "REGULAR",
      component: (
        <Regular
          behaviorIndex={behaviorIndex}
          setBehaviorIndex={setBehaviorIndex}
          totalBehaviors={7}
          setComplete={setComplete}
        />
      ),
    },
    {
      name: "SKIPPING",
      component: (
        <Skipping
          behaviorIndex={behaviorIndex}
          setBehaviorIndex={setBehaviorIndex}
          totalBehaviors={7}
          setComplete={setComplete}
        />
      ),
    },
    {
      name: "REREAD",
      component: (
        <ReReading
          behaviorIndex={behaviorIndex}
          setBehaviorIndex={setBehaviorIndex}
          totalBehaviors={7}
          setComplete={setComplete}
        />
      ),
    },
  ];

  useEffect(() => {
    // Clear logs
    gazeLogger.clear();
    scrollLogger.clear();
    actionsLogger.clear();
  }, []);

  // Debugging
  useEffect(() => {
    // Define the click event handler function
    const aoiEncoding = (e: any) => {
      const aoi = AOIEncoding(e.detail.x, e.detail.y);

      // Create the event data
      let data = {};
      if (aoi != null) {
        data = {
          t: e.detail.t,
          x: e.detail.x,
          y: e.detail.y,
          aoiType: aoi.aoiType,
          aoiInfo: aoi.aoiInfo,
          rX: aoi.rX,
          rY: aoi.rY,
        };
      } else {
        data = {
          t: e.detail.t,
          x: e.detail.x,
          y: e.detail.y,
          aoiType: "",
          aoiInfo: "",
          rX: 0,
          rY: 0,
        };
      }
      const event = new CustomEvent("processedGazeUpdate", { detail: data });

      // Dispatch the event on the document
      document.dispatchEvent(event);
    };

    // Attach the event listener to the window object
    document.addEventListener("gazeUpdate", aoiEncoding);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("gazeUpdate", aoiEncoding);
    };
  }, []); // Empty dependency array means this effect runs only once after the initial render

  useEffect(() => {
    const uploadLogs = async () => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      // Generate a session ID
      const session_id = generateUUID();
      const session_fp = `course_${props.course.id}/assignment_${props.assignment.id}/activity_${props.activity.id}/profile_${props.profile.id}/session_${session_id}`;

      // Create a path
      try {
        // Upload
        gazeLogger.upload(createTracelogFile, props.activityData.id, `${session_fp}/gaze.csv`);
        scrollLogger.upload(createTracelogFile, props.activityData.id, `${session_fp}/scroll.csv`);
        actionsLogger.upload(createTracelogFile, props.activityData.id, `${session_fp}/actions.csv`);
        mouseLogger.upload(createTracelogFile, props.activityData.id, `${session_fp}/mouse.csv`);

        // Meta data
        const meta_file = new Blob(
          [
            JSON.stringify({
              tracelog_date_uploaded: new Date().toISOString(),
              session_id: session_id,
              course_id: props.course.id,
              assignment: props.assignment,
              assignment_data: props.assignmentData,
              activity: props.activity,
              activity_data: props.activityData,
              profile_id: props.profile.id,
              questions: props.questions,
              readingFiles: readingFiles,
            }),
          ],
          { type: "application/json;charset=utf-8" },
        );
        const meta_filepath = `${session_fp}/meta.json`;
        const meta_result = await createTracelogFile.mutateAsync({
          activityDataId: props.activityData.id,
          filepath: meta_filepath,
        });
        const meta_storage_result = await supabase.storage
          .from("tracelogs")
          .upload(meta_filepath, meta_file);

        setIsSubmitting(false);

        if (meta_storage_result.error) {
          console.error("Failed to upload meta data");
        }
      } catch (error) {
        console.error("Failed to upload tracelogs");
      }
    };

    if (complete) {
      uploadLogs();
    }
  }, [complete]);

  return (
    <>
      <div className="flex w-full items-center justify-center">
        <EyeTrackingController
          complete={complete}
          runningET={runningET}
          setRunningET={setRunningET}
        />

        {inInstructions && (
          <InstructionsModal
            setInInstructions={setInInstructions}
            runningET={runningET}
          />
        )}

        {complete ? (
          <>
            <ActivityCompletion
              {...props}
              complete={complete}
              isSubmitting={isSubmitting}
            />
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </>
  );
}
