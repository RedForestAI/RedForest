"use client";
import {
  Activity,
  ReadingFile,
  ActivityData,
  Question,
  TraceLogFile,
} from "@prisma/client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { IDocument } from "@cyntler/react-doc-viewer";

import Table, { ColumnType } from "./Table";
import PDFViewer from "~/components/pdf/pdf-viewer";
import LoadFilesProgress from "../general/LoadFilesProgress";
import TrajectoryPlot from "../general/TrajectoryPlot";
import HeatMapOverlay from "./HeatmapOverlay";
import { loadCSVData, getFileStem } from "~/utils/log_utils";
import { PerStudentData, colorMap } from "../types";
import LogProcessing from "./FileProcessing";

type ReadingReportProps = {
  activity: Activity;
  readingFiles: ReadingFile[];
  activityDatas: ActivityData[];
  questions: Question[];
  tracelogs: TraceLogFile[];
  colors: colorMap
};

export default function ReadingReport(props: ReadingReportProps) {
  const [docs, setDocs] = useState<{ uri: string }[]>([]);
  const [activeDocument, setActiveDocument] = useState<IDocument>();
  const [columns, setColumns] = useState<ColumnType[]>([
    { title: "ID" },
    { title: "Complete" },
    { title: "Score" },
  ]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string[]>([]);
  const [filesDownloaded, setFilesDownloaded] = useState<boolean>(false);
  const [traceBlobs, setTraceBlobs] = useState<Blob[]>([]);
  const [perStudentDatas, setPerStudentDatas] = useState<{
    [key: string]: PerStudentData;
  }>({});

  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchPDFs() {
      // If there are no files, return
      if (props.readingFiles == undefined || props.readingFiles.length == 0) {
        return;
      }

      // Get the public URLs for the files
      const filepaths = props.readingFiles.map((file) => file.filepath);

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
    }

    if (docs.length == 0) {
      fetchPDFs();
    }

    // Compute the column and table data from the activityDatas
    if (props.activityDatas == undefined || props.activityDatas.length == 0) {
      return;
    }

    // Get the column names
    const columnNames = props.questions.map((question) => ({
      title: `Q${question.index} (${question.pts})`,
    }));
    setColumns([
      { title: "ID" },
      { title: "Complete" },
      { title: "Score" },
      ...columnNames,
    ]);

    const newTableData = props.activityDatas.map((activityData) => {
      const questionScores = activityData.answersTrace.map(
        (answerTrace: any, index: Number) => {
          return Number(answerTrace.correct);
        },
      );

      return [
        activityData.profileId,
        Number(activityData.completed),
        activityData.score,
        ...questionScores,
      ];
    });

    // Default select all rows
    setSelectedId(newTableData.map((row) => row[0] as string));
    setTableData(newTableData);
  }, []);

  useEffect(() => {
    if (filesDownloaded) {
      async function processTraceLogs() {
        // First, parse the data and create per-student session logs
        const loadingPerStudentDatas: { [key: string]: PerStudentData } = {};
        for (let i = 0; i < traceBlobs.length; i++) {
          const blobMeta = props.tracelogs[i];
          const blob = traceBlobs[i];
          if (blobMeta == undefined || blob == undefined) {
            return;
          }

          // Handle types of data
          let perStudentData: PerStudentData | undefined = undefined;
          let stem: string = "";
          let logData = {};

          switch (blob.type) {
            case "application/json":
              const jsonData = await blob.text();
              const logs = JSON.parse(jsonData);
              stem = getFileStem(blobMeta.filepath);
              logData = { [stem]: logs };
              perStudentData = {
                id: blobMeta.profileId,
                logs: logData,
                dataStore: {},
              };
              break;

            case "text/csv":
              const data = await loadCSVData(blob);
              stem = getFileStem(blobMeta.filepath);
              logData = { [stem]: data };
              perStudentData = {
                id: blobMeta.profileId,
                logs: logData,
                dataStore: {},
              };
              break;
          }

          // Combine the logs
          if (perStudentData == undefined) {
            return;
          }

          const existingData = loadingPerStudentDatas[perStudentData.id];
          if (existingData) {
            existingData.logs = {
              ...existingData.logs,
              ...perStudentData.logs,
            };
          } else {
            loadingPerStudentDatas[perStudentData.id] = perStudentData;
          }
        }

        // Process the data
        LogProcessing({
          questions: props.questions,
          perStudentDatas: loadingPerStudentDatas,
          activityDatas: props.activityDatas,
          setPerStudentData: setPerStudentDatas,
        });
      }

      processTraceLogs();
    }
  }, [filesDownloaded]);

  return (
    <div className="flex w-full flex-row">
      <div className="max-h-[90vh] w-1/2 overflow-y-auto">
        <PDFViewer
          docs={docs}
          files={props.readingFiles}
          activeDocument={activeDocument!}
          setActiveDocument={setActiveDocument}
          config={{
            defaultWidth: 100,
            supportZoom: false,
          }}
        >
          {filesDownloaded &&
            <HeatMapOverlay
              perStudentDatas={perStudentDatas}
              docs={docs}
              activeDocument={activeDocument}
              selectedId={selectedId}
            />
          }
        </PDFViewer>
      </div>

      <div className="ml-4 mr-4 mt-[4.5%] flex w-1/2 flex-col gap-8">
        <div className="max-h-96 overflow-x-auto overflow-y-auto">
          <Table
            columns={columns}
            tableData={tableData}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            colors={props.colors}
          />
        </div>

        {!filesDownloaded ? (
          <>
            <div>
              <LoadFilesProgress
                tracelogs={props.tracelogs}
                traceBlobs={traceBlobs}
                setTraceBlobs={setTraceBlobs}
                filesDownloaded={filesDownloaded}
                setFilesDownloaded={setFilesDownloaded}
              />
            </div>
          </>
        ) : (
          <>
            <TrajectoryPlot
              perStudentDatas={perStudentDatas}
              activityDatas={props.activityDatas}
              selectedId={selectedId}
              colors={props.colors}
            />
          </>
        )}
      </div>
    </div>
  );
}
