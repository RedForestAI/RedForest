"use client";

import { Activity, ReadingFile, ActivityData, Question } from "@prisma/client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { IDocument } from "@cyntler/react-doc-viewer";

import Table, { ColumnType } from "./Table";
import PDFViewer from "~/components/pdf/pdf-viewer";

type ReadingReportProps = {
  activity: Activity
  readingFiles: ReadingFile[]
  activityDatas: ActivityData[]
  questions: Question[]
}

export default function ReadingReport(props: ReadingReportProps) {
  // console.log(props);
  const [ docs, setDocs ] = useState<{ uri: string }[]>([]);
  const [ activeDocument, setActiveDocument ] = useState<IDocument>();
  const [ columns, setColumns ] = useState<ColumnType[]>([{ title: "ID" }])
  const [ tableData, setTableData ] = useState<any[]>([])
  const supabase = createClientComponentClient();

  // const columns = [
  //   { title: "Name" },
  //   { title: "Job" },
  //   { title: "Company" },
  //   { title: "Location" },
  //   { title: "Last Login" },
  //   { title: "Favorite Color" },
  // ]
  
  // const data = [
  //   ["Cy Ganderton", "Quality Control Specialist", "Littel, Schaden and Vandervort", "Canada", "12/16/2020", "Blue"],
  // ]

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
    const columnNames = props.questions.map((question) => ({title: `Q${question.index} (${question.pts})`}));
    setColumns([{ title: "ID" }, { title: "Complete" }, { title: "Score" }, ...columnNames]);

    // Get the table data
    const newTableData = props.activityDatas.map((activityData) => {

      // Match student answers to the question answers to mark which questions were correct
      const questionScores = activityData.answers.map((answer, index) => {
        return Number(answer == props.questions[index]?.answer);
      });

      return [activityData.id.split('-')[0], Number(activityData.completed), activityData.score, ...questionScores];
    });
    setTableData(newTableData);

  }, []);
  
  return (
    <div className="w-full flex flex-row">
      <div className="w-1/2">
        <PDFViewer
          docs={docs}
          files={props.readingFiles}
          activeDocument={activeDocument!}
          setActiveDocument={setActiveDocument}
          config={{
            defaultWidth: 100,
            supportZoom: false
          }}
        />
      </div>

      <div className="w-1/2 mt-[4.5%] max-h-96 overflow-x-auto overflow-y-auto">
        <Table columns={columns} tableData={tableData}/>
      </div>
    </div>
  )
}