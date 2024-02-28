"use client";

import { Activity, ReadingFile } from "@prisma/client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { IDocument } from "@cyntler/react-doc-viewer";

import PDFViewer from "~/components/pdf/pdf-viewer";

type ReadingReportProps = {
  activity: Activity
  readingFiles: ReadingFile[]
}

export default function ReadingReport(props: ReadingReportProps) {
  const [docs, setDocs] = useState<{ uri: string }[]>([]);
  const [activeDocument, setActiveDocument] = useState<IDocument>();

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
            defaultWidth: 100
          }}
        />
      </div>
    </div>
  )
}