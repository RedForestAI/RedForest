import { ReadingFile } from '@prisma/client'
import React, { useState} from 'react';
import { IDocument } from '@cyntler/react-doc-viewer';

import { triggerActionLog } from "~/loggers/actions-logger";

export function DocumentDrawer(props: {files: ReadingFile[], docs: {uri: string}[], activeDocument: IDocument | undefined, setActiveDocument: (doc: IDocument) => void}){
  const [open, setOpen] = useState(true)

  function openDrawer() {
    setOpen(!open)
  }

  function changeDocument(index: number) {
    props.setActiveDocument(props.docs[index]!)
    triggerActionLog({type: "pdfLoad", value: {index: index}});
  }

  return (
    <div id="DocumentPane" className={`min-h-screen bg-base-300 w-1/4 fixed top-0 left-0 border-r z-[70] transition ease-in-out duration-200 ${open ? "-translate-x-[23vw]" : ""}`}>
        <div className="flex flex-row w-full">
          <div className="w-full mt-20 flex flex-col gap-4 p-2">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">Documents</h1>
              <div className="h-1 bg-base-200"></div>
            </div>
            {props.files.map((file, index) => (
              <button 
                key={index} 
                className={`text-left btn-ghost ${props.activeDocument?.uri == props.docs[index]?.uri ? "text-primary" : "text-base"}`} 
                onClick={() => {changeDocument(index)}}>
                  {file.title}
              </button>
            ))}
          </div>
          <button className="bg-base-200 min-h-screen border-l w-[2vw] cursor-pointer" onClick={openDrawer}>
            <div className="w-full rotate-90 whitespace-nowrap text-primary">
              DOC TRAY
            </div>
          </button>
        </div>
    </div>
  )
}
