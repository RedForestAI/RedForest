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
import TrajectoryPlot, { Line } from "../general/TrajectoryPlot";

type ReadingReportProps = {
  activity: Activity;
  readingFiles: ReadingFile[];
  activityDatas: ActivityData[];
  questions: Question[];
  tracelogs: TraceLogFile[];
};

const line = {
  color: "#008561",
  data: {
    x: ['2018-03-01', '2018-04-01', '2018-05-01'],
    y: [30, 16, 17]
  }
}

const line2 = {
  color: "#080561",
  data: {
    x: ['2018-03-01', '2018-04-01', '2018-05-01'],
    y: [60, 66, 67]
  }
}

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
  const [filesDownloaded, setFilesDownloaded] = useState<boolean>(true);
  const [traceBlobs, setTraceBlobs] = useState<Blob[]>([]);
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

    // Get the table data
    let totalQuestionScores: any = []
    const newTableData = props.activityDatas.map((activityData) => {
      // Match student answers to the question answers to mark which questions were correct
      const questionScores = activityData.answers.map((answer, index) => {
        return Number(answer == props.questions[index]?.answer);
      });
      totalQuestionScores.push(questionScores)

      return [
        activityData.id.split("-")[0],
        Number(activityData.completed),
        activityData.score,
        ...questionScores,
      ];
    });

    // Set data for the trajectory plot
    console.log(totalQuestionScores);

    // Default select all rows
    setSelectedId(newTableData.map((row) => row[0] as string));
    setTableData(newTableData);
  }, []);

  // useEffect(() => {
  //   if (filesDownloaded) {
  //   }
  // }, [filesDownloaded]);

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
        />
      </div>

      <div className="ml-4 mr-4 mt-[4.5%] flex w-1/2 flex-col gap-24">
        <div className="max-h-96 overflow-x-auto overflow-y-auto">
          <Table
            columns={columns}
            tableData={tableData}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
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
            <div className="w-full">
              <TrajectoryPlot lines={[line, line2]} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
