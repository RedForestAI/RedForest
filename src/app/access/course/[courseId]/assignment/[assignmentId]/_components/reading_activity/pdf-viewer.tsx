import { ReadingFile } from '@prisma/client'
import React, { useMemo, useState, useEffect, useContext } from 'react';
import DocViewer, { DocViewerRenderers, IDocument } from '@cyntler/react-doc-viewer';
import { faMagnifyingGlass, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import BlurModal from './blur-modal';
import { useMiddleNavBarContext, useEndNavBarContext } from '~/providers/navbar-provider';
import { triggerActionLog } from "~/loggers/actions-logger";
import { ToolKit } from './toolkit';
import "./pdf-viewer.css"
import { set } from 'zod';

function DocumentDrawer(props: {files: ReadingFile[], docs: {uri: string}[], activeDocument: IDocument | undefined, setActiveDocument: (doc: IDocument) => void}){
  const [open, setOpen] = useState(true)

  function openDrawer() {
    setOpen(!open)
  }

  function changeDocument(index: number) {
    props.setActiveDocument(props.docs[index]!)
    triggerActionLog({type: "pdfLoad", value: {index: index}});
  }

  return (
    <div id="DocumentPane" className={`h-screen bg-base-300 w-1/4 fixed top-0 left-0 border-r border-t z-10 transition ease-in-out duration-200 ${open ? "-translate-x-[23vw]" : ""}`}>
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
          <button className="bg-base-200 h-screen border-l w-[2vw] cursor-pointer" onClick={openDrawer}>{
            open ? <FontAwesomeIcon icon={faPlus}/> 
                 : <FontAwesomeIcon icon={faMinus}/>
          }
          </button>
        </div>
    </div>
  )
}


export default function PDFViewer(props: {files: ReadingFile[]}) {
  const supabase = createClientComponentClient();
  const [activeDocument, setActiveDocument ] = useState<IDocument>();
  const [docs, setDocs] = useState<{uri: string}[]>([]);
  const setMiddleNavBarContent = useContext(useMiddleNavBarContext);
  const [zoomLevel, setZoomLevel] = useState(1); // Starting zoom level
  const [error, setError] = useState<string | null>(null);
  const [readingStart, setReadingStart] = useState<boolean>(true);
  const [viewerKey, setViewerKey] = React.useState(0); //Viewer key state
  const [toolkitPosition, setToolkitPosition] = useState({
    x: 0,
    y: 0,
    w: 0,
    h: 0, 
    isVisible: false, 
  });
  const [toolkitText, setToolkitText] = useState("");
  const [toolkitRects, setToolkitRects] = useState<DOMRectList>();

  // Memo
  const docViewer = useMemo(() => {

    // Required to force the viewer to re-render when the active document changes
    setViewerKey((prev) => prev + 1);

    return (<DocViewer
      documents={docs}
      activeDocument={activeDocument}
      key={viewerKey}
      onDocumentChange={(newDoc) => {
        setActiveDocument(newDoc)
      }}
      pluginRenderers={DocViewerRenderers}
      style={{ width: `${70*zoomLevel}%`, height: `100%`, backgroundColor: "transparent"}}
      prefetchMethod="GET"
      config={{
        loadingRenderer: {
          overrideComponent: () => {
            return <span className="loading loading-spinner loading-lg"></span>
          }
        },
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
    />)
  }, [docs, activeDocument, zoomLevel])

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection == null) {
      return;
    }
  
    if (selection.toString().trim().length > 0) {
      const range = selection.getRangeAt(0);
      const rects = range.getClientRects(); // Get all rects for each line
  
      if (rects.length > 0) {
        // Example: Show the toolkit near the first line of selection
        const firstRect = rects[0];
        if (firstRect == undefined) return;
        setToolkitPosition({
          x: firstRect.x, 
          y: firstRect.y, 
          w: firstRect.width, 
          h: firstRect.height, 
          isVisible: true,
        });
        setToolkitText(selection.toString());
        setToolkitRects(rects);
      }
    } else {
      setToolkitPosition({
        x: 0,
        y: 0,
        w: 0,
        h: 0, 
        isVisible: false, 
      });
      setToolkitText("");
      setToolkitRects(undefined);
    }
  };


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

    // Add toolkits
    document.addEventListener('mouseup', handleTextSelection);

    // Reset the navbar content when the component unmounts
    return () => {
      setMiddleNavBarContent(null);
      document.removeEventListener('mouseup', handleTextSelection);
    }
  }, []);

  useEffect(() => {

    async function fetchPDFs() {
      // If there are no files, return
      if (props.files == undefined || props.files.length == 0) {
        return;
      }

      // Get the public URLs for the files
      const filepaths = props.files.map((file) => file.filepath);

      // For each file, download the file
      let files: Blob[] = []

      for (let i = 0; i < filepaths.length; i++) {
        const filepath = filepaths[i];
        if (filepath == null) {
          setError("Failed to fetch URLs for the files. Please logout and try again.");
          return;
        }
        const { data, error } = await supabase
          .storage
          .from('activity_reading_file')
          .download(filepath)
        
        if (error) {
          console.error(error);
          setError(error.message);
          return;
        }

        files.push(data as Blob);
      }

      // Iterate through the files and add them to the docs array
      if (files.length == 0) {
        setError("Failed to fetch URLs for the files. Please logout and try again.");
        return;
      }

      // Create URLs for the files
      const newDocs = files.map((file: any) => {
        return {
          uri: URL.createObjectURL(file),
          fileType: "pdf"
        }
      });
      setDocs(newDocs);
      setActiveDocument(newDocs[0]);
      triggerActionLog({type: "pdfLoad", value: {index: 0}});
    }

    if (docs.length == 0){
      fetchPDFs();
    }

  }, [props.files])

  function onReadingStart() {
    setReadingStart(true);
    triggerActionLog({type: "readingStart", value: {start: true}});
  }

  async function onHighlight() {
    console.log("Highlighting", toolkitText, toolkitRects)
  }

  async function onAnnotate() {
  }

  async function onLookup() {
  }

  return (
      <>
        {!readingStart && 
          <BlurModal onContinue={onReadingStart}/>
        }

        <ToolKit 
          x={toolkitPosition.x} 
          y={toolkitPosition.y}
          w={toolkitPosition.w}
          h={toolkitPosition.h}
          isVisible={toolkitPosition.isVisible}
          onHighlight={onHighlight} 
          onAnnotate={onAnnotate} 
          onLookup={onLookup}
        />
        
        <DocumentDrawer files={props.files} docs={docs} activeDocument={activeDocument} setActiveDocument={setActiveDocument}/>
        {error && <div className="text-red-500">{error}</div>}
        
        <div className={`w-full h-full flex flex-row justify-center items-center ${readingStart ? "" : "blur-lg"}`}>
          {docViewer}
        </div>
      </>
  );
};