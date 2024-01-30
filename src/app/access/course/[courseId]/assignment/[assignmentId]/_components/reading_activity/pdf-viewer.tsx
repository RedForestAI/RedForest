import { ReadingFile } from '@prisma/client'
import React, { useRef, useState, useEffect, useContext } from 'react';
import DocViewer, { DocViewerRenderers, IDocument } from '@cyntler/react-doc-viewer';
import { useMiddleNavBarContext, useEndNavBarContext } from '~/providers/navbar-provider';
import { faMagnifyingGlass, faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import "./pdf-viewer.css"

function DocumentDrawer(props: {files: ReadingFile[], docs: {uri: string}[], activeDocument: IDocument | undefined, setActiveDocument: (doc: IDocument) => void}){
  const [open, setOpen] = useState(true)

  function openDrawer() {
    setOpen(!open)
  }

  return (
    <div className={`h-screen bg-base-300 w-1/4 fixed top-0 left-0 border-r border-t z-10 transition ease-in-out duration-200 ${open ? "-translate-x-[23vw]" : ""}`}>
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
                onClick={() => props.setActiveDocument(props.docs[index]!)}>
                  {file.title}
              </button>
            ))}
          </div>
          <button className="bg-base-200 h-screen border-l w-[2vw] cursor-pointer" onClick={openDrawer}>{open ? "+" : "-"}</button>
        </div>
    </div>
  )
}


export default function PDFViewer(props: {files: ReadingFile[]}) {
  const supabase = createClientComponentClient();
  const [ activeDocument, setActiveDocument ] = useState<IDocument>();
  const [ docs, setDocs ] = useState<{uri: string}[]>([]);
  const setMiddleNavBarContent = useContext(useMiddleNavBarContext);
  const [zoomLevel, setZoomLevel] = useState(1); // Starting zoom level

  useEffect(() => {
    // Define the content you want to add to the navbar
    const middleNavBarExtras = (
      <div className="flex flex-row gap-2 items-center ">
        <button className="btn btn-ghost" onClick={() => setZoomLevel((prev) => (prev-0.1))}>-</button>
          <FontAwesomeIcon icon={faMagnifyingGlass}/>
        <button className="btn btn-ghost" onClick={() => setZoomLevel((prev) => (prev+0.1))}>+</button>
      </div>
    );

    // Update the navbar content
    setMiddleNavBarContent(middleNavBarExtras);

    // Reset the navbar content when the component unmounts
    return () => {
      setMiddleNavBarContent(null);
    }
  }, []);

  useEffect(() => {

    // If there are no files, return
    if (props.files == undefined || props.files.length == 0) {
      return;
    }

    // Get the public URLs for the files
    const filepaths = props.files.map((file) => file.filepath);

    // For each file, get the public URL
    let urls: string[] = []
    for (let i = 0; i < filepaths.length; i++) {
      const { data: {publicUrl} } = supabase.storage.from('activity_reading_file').getPublicUrl(filepaths[i]!); 
      urls.push(publicUrl);
    }

    if (urls.length == 0) {
      return;
    }

    // Iterate through the files and add them to the docs array
    const newDocs = urls.map((url: any) => {
      return {
        uri: url
      }
    });
    setDocs(newDocs);

  }, [props.files])

  return (
      <>
        <DocumentDrawer files={props.files} docs={docs} activeDocument={activeDocument} setActiveDocument={setActiveDocument}/>
        <DocViewer
          documents={docs}
          activeDocument={activeDocument}
          onDocumentChange={(newDoc) => {setActiveDocument(newDoc)}}
          pluginRenderers={DocViewerRenderers}
          style={{ width: `${70*zoomLevel}%`, height: `100%` }}
          config={{
            header: {
              disableHeader: true,
              disableFileName: true,
              retainURLParams: true
            },
            pdfVerticalScrollByDefault: true,
            pdfZoom: {
              defaultZoom: zoomLevel,
              zoomJump: 0.1
            }
          }}
        />
      </>
  );
};