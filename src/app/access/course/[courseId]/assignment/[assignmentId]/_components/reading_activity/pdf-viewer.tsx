import { ReadingFile, Highlight } from '@prisma/client'
import React, { useMemo, useState, useEffect, useContext } from 'react';
import DocViewer, { DocViewerRenderers, IDocument } from '@cyntler/react-doc-viewer';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { api } from "~/trpc/react";

import BlurModal from './blur-modal';
import { useMiddleNavBarContext, useEndNavBarContext } from '~/providers/navbar-provider';
import { triggerActionLog } from "~/loggers/actions-logger";
import { ToolKit } from './toolkit';
import { DocumentDrawer } from './document-drawer';
import { parsePrisma } from "~/utils/prisma";
import "./pdf-viewer.css"

function debounce<F extends (...args: any[]) => void>(func: F, wait: number): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function(...args: Parameters<F>): void {
    const later = () => {
      clearTimeout(timeout as ReturnType<typeof setTimeout>);
      func(...args);
    };

    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}

export default function PDFViewer(props: {files: ReadingFile[], highlights: Highlight[], setHighlights: any, activityDataId: string}) {
  const supabase = createClientComponentClient();
  const [activeDocument, setActiveDocument ] = useState<IDocument>();
  const [docs, setDocs] = useState<{uri: string}[]>([]);
  const setMiddleNavBarContent = useContext(useMiddleNavBarContext);
  const [zoomLevel, setZoomLevel] = useState(1); // Starting zoom level
  const [error, setError] = useState<string | null>(null);
  const [readingStart, setReadingStart] = useState<boolean>(true);
  const [viewerKey, setViewerKey] = React.useState(0); //Viewer key state

  // Toolkit
  const [toolkitPosition, setToolkitPosition] = useState({
    x: 0,
    y: 0,
    w: 0,
    h: 0, 
    isVisible: false, 
  });
  const [toolkitText, setToolkitText] = useState("");
  const [toolkitRects, setToolkitRects] = useState<DOMRect[]>([]);

  // Highlights
  const [pages, setPages] = useState<Element[]>([]);

  // Mutation
  const createHighlight = api.highlight.create.useMutation();
  const deleteHighlight = api.highlight.delete.useMutation();

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

  useEffect(() => {
    const container = document.querySelector('#pdf-viewer-container');
    if (!container) return;
    
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

    // Add observer to determine once the document is loaded
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {

          // There is a ``div.endOfContent`` that helps us know when the PDF is loaded
          const addedPages = Array.from(mutation.addedNodes).filter((node) => node.nodeName === 'DIV');
          for (const page of addedPages) {

            // @ts-ignore
            if (page.className.includes('endOfContent')) {
              // console.log("endOfContent detected")
              handlePDFLoad();
            }
          }
        }
      }
    });

    const config = { childList: true, subtree: true };
    observer.observe(container, config);

    // Reset the navbar content when the component unmounts
    return () => {
      setMiddleNavBarContent(null);
      document.removeEventListener('mouseup', handleTextSelection);
      observer.disconnect();
    }
  }, []);

  useEffect(() => {

    // Once the PDF is loaded, let's draw all the highlights
    if (pages.length > 0) {
      for (const page of pages) {
        const pageNumber = page.getAttribute("data-page-number");
        if (pageNumber == null) {
          continue;
        }

        const pageHighlights = props.highlights.filter((highlight) => {

          // Check if the highlight is on the current page via ID,
          // Skip if the highlight already exists
          let existingHighlight = document.getElementById(highlight.id);
          if (existingHighlight) {
            return false;
          }

          // Check the file ID
          const index = docs.findIndex((doc) => doc.uri == activeDocument?.uri);
          const file = props.files[index];
          if (file == undefined) {
            return false;
          }
          if (highlight.fileId != file.id) {
            return false;
          }

          // Page Check
          const rects = parsePrisma(highlight.rects);
          for (const rect of rects) {
            if (rect.page == pageNumber) {
              return true;
            }
          }
          return false;
        });

        for (const highlight of pageHighlights) {
          const rects = parsePrisma(highlight.rects);
          for (const rect of rects) {
            const highlightElement = document.createElement("div");
            highlightElement.className = `highlight_${highlight.id} absolute`;
            highlightElement.style.top = `${rect.y * 100}%`;
            highlightElement.style.left = `${rect.x * 100}%`;
            highlightElement.style.width = `${rect.width * 100}%`;
            highlightElement.style.height = `${rect.height * 100}%`;
            highlightElement.style.backgroundColor = "rgba(245, 161, 66, 0.5)";
            highlightElement.style.zIndex = "45";
            page.appendChild(highlightElement);
          }
        }
      }
    }

  }, [pages])

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

  useEffect(() => {

    let rects = []

    // Determine the index of the active document
    const index = docs.findIndex((doc) => doc.uri == activeDocument?.uri);
    const file = props.files[index];

    if (file == undefined) {
      return;
    }

    // Iterate through each highlight
    for (const high of props.highlights) {

      // Only parse the JSON if the file ID matches the active document
      if (high.fileId != file.id) {
        continue;
      }

      // Parse the JSON
      const datas = parsePrisma(high.rects)
      for (const data of datas) {
        rects.push(data)
      }
    }

    // Deselect text after highlighting
    if (window.getSelection) {
      window?.getSelection()?.removeAllRanges();
    } else if (document.getSelection()) {  // For IE
      document.getSelection()?.empty();
    }

  }, [props.highlights, docViewer])

  const handlePDFLoad  = debounce(() => {
    const pages = document.querySelectorAll('.react-pdf__Page');
    setPages(Array.from(pages));
  }, 100)

  const handleTextSelection = debounce(() => {
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

        // Include scroll offsets in the position calculation
        const x = firstRect.left + window.scrollX;
        const y = firstRect.top + window.scrollY;
        setToolkitPosition({
          x: x, 
          y: y, 
          w: firstRect.width, 
          h: firstRect.height, 
          isVisible: true,
        });
        setToolkitText(selection.toString());

        let rectList: DOMRect[] = []

        for (const [key, value] of Object.entries(rects)) {

          // Include scroll offsets in the position calculation
          value.x += window.scrollX;
          value.y += window.scrollY;

          rectList.push(value)
        }

        // Remove any rects that collide with each other
        let i = 0;
        while (i < rectList.length) {
          let j = i + 1;
          while (j < rectList.length) {
            // @ts-ignore
            if (rectList[i].y < rectList[j].y + rectList[j].height &&
              // @ts-ignore
              rectList[i].y + rectList[i].height > rectList[j].y) {
                rectList.splice(j, 1);
            } else {
              j++;
            }
          }
          i++;
        }

        // Set the state
        setToolkitRects(rectList);

        // Log the information
        triggerActionLog({type: "selection", value: {
          text: selection.toString(),
          rects: rectList
        }});

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
      setToolkitRects([]);
      
      // Log the information
      triggerActionLog({type: "deselection", value: {}});
    }
  }, 50);

  function onReadingStart() {
    setReadingStart(true);
    triggerActionLog({type: "readingStart", value: {start: true}});
  }

  async function onHighlight() {

    // Determine the index of the active document
    const index = docs.findIndex((doc) => doc.uri == activeDocument?.uri);

    // Get the file ID (matching the index of the file)
    const file = props.files[index];
    if (file == undefined) {
      return;
    }

    // Translate the rects to the pages
    let relativeRects = [];
    for (const rect of toolkitRects) {
      for (const page of pages) {
        const pageRect = page.getBoundingClientRect();
        if (rect.y >= pageRect.top && rect.y <= pageRect.bottom) {
          let relativeRect = {
            page: page.getAttribute("data-page-number"),
            x: (rect.x - pageRect.x) / pageRect.width,
            y: (rect.y - pageRect.y) / pageRect.height,
            width: rect.width / pageRect.width,
            height: rect.height / pageRect.height,
          }
          relativeRects.push(relativeRect);
        }
      }
    }

    // If colliding with another highlight, delete the highlight
    let collision = false;
    for (const highlight of props.highlights) {

      // Only parse the JSON if the file ID matches the active document
      if (highlight.fileId != file.id) {
        continue;
      }

      const rects = parsePrisma(highlight.rects);
      for (const rRect of relativeRects) {
        for (const rect of rects) {
          if (rRect.page == rect.page) {
            const r1 = {
              x: rRect.x,
              y: rRect.y,
              width: rRect.width,
              height: rRect.height
            }
            const r2 = {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height
            }
            if (r1.x < r2.x + r2.width &&
              r1.x + r1.width > r2.x &&
              r1.y < r2.y + r2.height &&
              r1.y + r1.height > r2.y) {

                // Set collision to true
                collision = true;

                // Delete the highlight from the database
                await deleteHighlight.mutateAsync({id: highlight.id});

                // Remove the highlight from the state
                const newHighlights = props.highlights.filter((h) => h.id != highlight.id);
                props.setHighlights(newHighlights);

                // Remove the highlight from the DOM
                const highlightElements = document.querySelectorAll(`.highlight_${highlight.id}`);
                for (const highlightElement of highlightElements) {
                  highlightElement.remove();
                }

                // Log the information
                triggerActionLog({type: "dehighlight", value: {...highlight}});
                return;
              }
          }
        }
      }
    }

    // If there is a collision, return
    if (collision) {
      return;
    }

    // Create a highlight via mutation and add it
    const highlight = await createHighlight.mutateAsync({
      rects: JSON.stringify(relativeRects),
      content: toolkitText,
      fileId: file.id,
      activityDataId: props.activityDataId
    });
    props.setHighlights([...props.highlights, highlight]);

    // Log the information
    triggerActionLog({type: "highlight", value: {...highlight}});

    // Manually add the highligh to the children of the PDF Page it belongs to
    for (const rRect of relativeRects) {
    
      // @ts-ignore
      const page = pages[parseInt(rRect.page) - 1];
      if (page == undefined) {
        continue;
      }

      // Adding the highlight
      const highlightElement = document.createElement("div");
      highlightElement.className = `highlight_${highlight.id} absolute`;
      highlightElement.style.top = `${rRect.y * 100}%`;
      highlightElement.style.left = `${rRect.x * 100}%`;
      highlightElement.style.width = `${rRect.width * 100}%`;
      highlightElement.style.height = `${rRect.height * 100}%`;
      highlightElement.style.backgroundColor = "rgba(245, 161, 66, 0.5)";
      highlightElement.style.zIndex = "45";
      page.appendChild(highlightElement);
    }
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
        
        <div id="pdf-viewer-container" className={`w-full h-full flex flex-row justify-center items-center ${readingStart ? "" : "blur-lg"}`}>
          {docViewer}
        </div>
      </>
  );
};