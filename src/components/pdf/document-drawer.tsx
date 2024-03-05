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
    <div id="DocumentPane" className={`min-h-screen bg-base-100 border-neutral w-1/4 fixed top-0 left-0 border-r z-[70] transition ease-in-out duration-200 ${open ? "-translate-x-[23vw]" : ""}`}>
        <div className="flex flex-row w-full">
          <div className="w-full mt-20 flex flex-col gap-4 p-2">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold border-b border-neutral">Documents</h1>
            </div>
            {props.files.map((file, index) => (
              <button 
                key={index} 
                className={`text-left text-xl btn-ghost ${props.activeDocument?.uri == props.docs[index]?.uri ? "text-primary" : "text-base"}`} 
                onClick={() => {changeDocument(index)}}>
                  {file.title}
              </button>
            ))}
          </div>
          <button className="bg-base-200 min-h-screen border-l border-neutral w-[2vw] cursor-pointer" onClick={openDrawer}>
            <div className="w-full rotate-90 whitespace-nowrap text-primary">
              DOC TRAY
            </div>
          </button>
        </div>
    </div>
  )
}
