"use client";

import { useEffect, useState } from "react";
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
  Highlight,
  Annotation,
} from "@prisma/client";
import { api } from "~/trpc/react";

import EyeTrackingController from "~/eyetracking/eye-tracking-controller";
import PDFViewer from "./pdf-viewer";
import TaskDrawer from "./task-drawer";
import Questions from "../question_activity/questions";
import ActivityCompletion from "../activity-completion";
import { AOIEncoding } from "~/eyetracking/aoi-encoding";
import BlurModal from "./blur-modal";
import { triggerActionLog } from "~/loggers/actions-logger";

import GazeLogger from "~/loggers/gaze-logger";
import ScrollLogger from "~/loggers/scroll-logger";
import ActionsLogger from "~/loggers/actions-logger";
import MouseLogger from "~/loggers/mouse-logger";

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

export default function ReadingActivity(props: ReadingActivityProps) {
  const [complete, setComplete] = useState<boolean>(false);
  const [readingFiles, setReadingFiles] = useState<ReadingFile[]>([]);
  const [activeDocument, setActiveDocument] = useState<IDocument>();
  const [blur, setBlur] = useState<boolean>(true);
  const [docs, setDocs] = useState<{ uri: string }[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [runningET, setRunningET] = useState<boolean>(false);

  const readingActivityQuery = api.readingFile.getMany.useQuery(
    { activityId: props.activity.id },
    { enabled: false },
  );
  const highlightQuery = api.highlight.getMany.useQuery(
    { activityDataId: props.activityData.id },
    { enabled: false },
  );
  const annotationQuery = api.annotation.getMany.useQuery(
    { activityDataId: props.activityData.id },
    { enabled: false },
  );
  const createTracelogFile = api.traceLogFile.create.useMutation();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getReadingActivity = async () => {
      // Get the reading activity data
      const result = await readingActivityQuery.refetch();
      if (result.error || !result.data) {
        console.log(result.error);
        return;
      }

      // Get the highlights
      const highlightsResult = await highlightQuery.refetch();
      if (highlightsResult.error || !highlightsResult.data) {
        console.log(highlightsResult.error);
        return;
      }

      // Get the annotations
      const annotationsResult = await annotationQuery.refetch();
      if (annotationsResult.error || !annotationsResult.data) {
        console.log(annotationsResult.error);
        return;
      }

      // Sort the files by their index
      result.data.sort((a, b) => a.index - b.index);
      setReadingFiles(result.data);
      setHighlights(highlightsResult.data);
      setAnnotations(annotationsResult.data);
    };
    getReadingActivity();

    // Clear logs
    gazeLogger.clear();
    scrollLogger.clear();
    actionsLogger.clear();
    mouseLogger.clear();
  }, []);

  useEffect(() => {
    async function fetchPDFs() {
      // If there are no files, return
      if (readingFiles == undefined || readingFiles.length == 0) {
        return;
      }

      // Get the public URLs for the files
      const filepaths = readingFiles.map((file) => file.filepath);

      // For each file, download the file
      let files: Blob[] = [];

      for (let i = 0; i < filepaths.length; i++) {
        const filepath = filepaths[i];
        if (filepath == null) {
          return;
        }
        const { data, error } = await supabase.storage
          .from("activity_reading_file")
          .download(filepath);

        if (error) {
          console.error(error);
          return;
        }

        files.push(data as Blob);
      }

      // Iterate through the files and add them to the docs array
      if (files.length == 0) {
        return;
      }

      // Create URLs for the files
      const newDocs = files.map((file: any) => {
        return {
          uri: URL.createObjectURL(file),
          fileType: "pdf",
        };
      });
      setDocs(newDocs);
      setActiveDocument(newDocs[0]);
      triggerActionLog({ type: "pdfLoad", value: { index: 0 } });
    }

    if (docs.length == 0) {
      fetchPDFs();
    }
  }, [readingFiles]);

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
        // Gaze
        const gaze_file = gazeLogger.getBlob();
        const gaze_filepath = `${session_fp}/gaze.csv`;
        const gaze_result = await createTracelogFile.mutateAsync({
          activityDataId: props.activityData.id,
          filepath: gaze_filepath,
        });
        const gaze_storage_result = await supabase.storage
          .from("tracelogs")
          .upload(gaze_filepath, gaze_file);

        if (gaze_storage_result.error) {
          console.error("Failed to upload gaze data");
        }

        // Scroll
        const scroll_file = scrollLogger.getBlob();
        const scroll_filepath = `${session_fp}/scroll.csv`;
        const scroll_result = await createTracelogFile.mutateAsync({
          activityDataId: props.activityData.id,
          filepath: scroll_filepath,
        });
        const scroll_storage_result = await supabase.storage
          .from("tracelogs")
          .upload(scroll_filepath, scroll_file);

        if (scroll_storage_result.error) {
          console.error("Failed to upload scroll data");
        }

        // Actions (QA & PDF)
        const actions_file = actionsLogger.getBlob();
        const actions_filepath = `${session_fp}/actions.csv`;
        const actions_result = await createTracelogFile.mutateAsync({
          activityDataId: props.activityData.id,
          filepath: actions_filepath,
        });
        const actions_storage_result = await supabase.storage
          .from("tracelogs")
          .upload(actions_filepath, actions_file);

        if (actions_storage_result.error) {
          console.error("Failed to upload actions data");
        }

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

  function onReadingStart() {
    setBlur(false);
    triggerActionLog({ type: "readingStart", value: { start: true } });
  }

  return (
    <>
      <div className="flex w-full items-center justify-center">
        <EyeTrackingController
          complete={complete}
          runningET={runningET}
          setRunningET={setRunningET}
        />

        {blur && <BlurModal onContinue={onReadingStart} />}

        <PDFViewer
          docs={docs}
          files={readingFiles}
          config={{
            toolkit: true,
            blur: blur,
            highlights: highlights,
            setHighlights: setHighlights,
            annotations: annotations,
            setAnnotations: setAnnotations,
          }}
          activityDataId={props.activityData.id}
          activeDocument={activeDocument!}
          setActiveDocument={setActiveDocument}
        />

        <TaskDrawer>
          <div id="QuestionPane" className="mt-20 w-full">
            {!complete ? (
              <Questions
                {...props}
                complete={complete}
                setComplete={setComplete}
                config={{ beforeStartPrompt: true }}
              />
            ) : (
              <ActivityCompletion
                {...props}
                complete={complete}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        </TaskDrawer>
      </div>
    </>
  );
}
