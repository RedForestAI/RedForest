import { useEffect, useState } from 'react'
import { TraceLogFile } from '@prisma/client'
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type LoadFilesProgressProps = {
  tracelogs: TraceLogFile[]
  traceBlobs: Blob[]
  setTraceBlobs: (traceBlobs: Blob[]) => void
  filesDownloaded: boolean
  setFilesDownloaded: (filesDownloaded: boolean) => void
}

export default function LoadFilesProgress(props: LoadFilesProgressProps) {
  const [progress, setProgress] = useState(10);
  const supabase = createClientComponentClient();

  useEffect(() => {
    let files: Blob[] = [];

    async function fetchFiles() {
      // If there are no files, return
      if (props.tracelogs == undefined || props.tracelogs.length == 0) {
        return;
      }
      if (props.filesDownloaded) {
        return;
      }

      for (let i = 0; i < props.tracelogs.length; i++) {
        const filepath = props.tracelogs[i]?.filepath;
        if (filepath == null) {
          return;
        }
        const { data, error } = await supabase.storage
          .from("tracelogs")
          .download(filepath);

        if (error) {
          console.error(error);
          return;
        }

        files.push(data as Blob);
        setProgress((i / (props.tracelogs.length-1)) * 100);
      }
      props.setTraceBlobs(files);
      props.setFilesDownloaded(true);
    }
    fetchFiles()
  }, [])
  
  return (
    <div className="flex flex-col justify-center items-center">
      <progress className="progress progress-primary w-4/5 mb-6" value={progress} max="100"></progress>
      <div>
        <p>Files are being loaded. Hold on tight...</p>
      </div>
    </div>
  )
}