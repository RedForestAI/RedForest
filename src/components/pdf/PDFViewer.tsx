import { ReadingFile, Highlight, Annotation } from "@prisma/client";
import React, { useMemo, useState, useEffect, useContext } from "react";
import DocViewer, {
  DocViewerRenderers,
  IDocument,
} from "@cyntler/react-doc-viewer";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { api } from "~/trpc/react";

import { generateUUID } from "~/utils/uuid";
import {
  useMiddleNavBarContext,
} from "~/providers/NavbarProvider";
import { triggerActionLog } from "~/loggers/ActionsLogger";
import { ToolKit } from "./ToolKit";
import { DictionaryEntry } from "./DictionaryEntry";
import { DocumentDrawer } from "./DocumentDrawer";
import { PageNoteAnnotationLayer } from "./AnnotationBox";
import { PageBtnLayer, rectBtn } from "./RectBtns";
import { parsePrisma } from "~/utils/prisma";
import { debounce } from "~/utils/functional";
import "./PDFViewer.css";

type PDFViewerProps = {
  docs: { uri: string }[];
  files: ReadingFile[];
  activeDocument: IDocument;
  setActiveDocument: any;
  children?: any;

  config?: {
    // General
    defaultWidth?: number;
    supportZoom?: boolean;

    // Reading Activity
    activityDataId?: string;
    blur?: boolean;
    toolkit?: boolean;
    highlights?: Highlight[];
    setHighlights?: any;
    annotations?: Annotation[];
    setAnnotations?: any;

    // Behavior Activity
    btnLayer?: boolean
    component?: React.ReactElement;
  }
};

const defaultConfig = {
  // General
  defaultWidth: 70,
  supportZoom: true,
  
  // Reading Activity
  activityDataId: "",
  blur: false,
  toolkit: false,
  highlights: [],
  setHighlights: (prev: any) => {},
  annotations: [],
  setAnnotations: (prev: any) => {},

  // Behavior Activity
  btnLayer: false,
  component: <></>
}

export default function PDFViewer(props: PDFViewerProps) {
  
  const finalConfig = {...defaultConfig, ...props.config}
  
  const [fileIndex, setFileIndex] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState(1); // Starting zoom level
  const [error, setError] = useState<string | null>(null);
  const [viewerKey, setViewerKey] = React.useState(0); //Viewer key state
  const [pages, setPages] = useState<Element[]>([]);

  // Toolkit
  const [toolkitPosition, setToolkitPosition] = useState({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    isVisible: false,
  });
  const [toolkitText, setToolkitText] = useState<string>("");
  const [toolkitRects, setToolkitRects] = useState<DOMRect[]>([]);

  // Dictionary
  const [dictError, setDictError] = useState<string | null>(null);
  const [dictEntry, setDictEntry] = useState<any | null>(null);

  // Mutation
  const createHighlight = api.highlight.create.useMutation();
  const deleteHighlight = api.highlight.delete.useMutation();
  const createAnnotation = api.annotation.create.useMutation();

  // Nav
  const setMiddleNavBarContent = useContext(useMiddleNavBarContext);

  function renderChildren(children: any, page: Element, index: number) {
    return React.Children.map(children, (child: any) => {
      return React.cloneElement(child, {
        page: page,
        index: index,
      });
    })
  }

  const docViewer = useMemo(() => {
    // Required to force the viewer to re-render when the active document changes
    setViewerKey((prev) => prev + 1);

    return (
      <DocViewer
        documents={props.docs}
        activeDocument={props.activeDocument}
        key={viewerKey}
        onDocumentChange={(newDoc) => {
          props.setActiveDocument(newDoc);
        }}
        pluginRenderers={DocViewerRenderers}
        style={{
          width: `${finalConfig.defaultWidth * zoomLevel}%`,
          height: `100%`,
          backgroundColor: "transparent",
        }}
        prefetchMethod="GET"
        config={{
          loadingRenderer: {
            overrideComponent: () => {
              return (
                <span className="loading loading-spinner loading-lg"></span>
              );
            },
          },
          header: {
            disableHeader: true,
            disableFileName: true,
            retainURLParams: true,
          },
          pdfVerticalScrollByDefault: true,
          pdfZoom: {
            defaultZoom: zoomLevel,
            zoomJump: 0.1,
          },
        }}
      />
    );
  }, [props.docs, props.activeDocument, zoomLevel]);

  useEffect(() => {
    const container = document.querySelector("#pdf-viewer-container");
    if (!container) return;

    // Define the content you want to add to the navbar
    const middleNavBarExtras = (
      <div className="flex flex-row items-center gap-2 ">
        <button
          className="btn btn-ghost"
          onClick={() => setZoomLevel((prev) => prev - 0.1)}
        >
          -
        </button>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        <button
          className="btn btn-ghost"
          onClick={() => setZoomLevel((prev) => prev + 0.1)}
        >
          +
        </button>
      </div>
    );

    // Update the navbar content
    if (finalConfig.supportZoom) setMiddleNavBarContent(middleNavBarExtras);

    // Add toolkits
    if (finalConfig.toolkit) {
      document.addEventListener("mouseup", handleTextSelection);
    }

    // Add observer to determine once the document is loaded
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          // There is a ``div.endOfContent`` that helps us know when the PDF is loaded
          const addedPages = Array.from(mutation.addedNodes).filter(
            (node) => node.nodeName === "DIV",
          );
          for (const page of addedPages) {
            // @ts-ignore
            if (page.className.includes("endOfContent")) {
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
      if (finalConfig.supportZoom) setMiddleNavBarContent(null);
      observer.disconnect();
      if (finalConfig.toolkit) {
        document.removeEventListener("mouseup", handleTextSelection);
      }
    };
  }, []);

  useEffect(() => {
    // Once the PDF is loaded, let's draw all the highlights
    if (pages.length > 0) {
      for (const page of pages) {
        const pageNumber = page.getAttribute("data-page-number");
        if (pageNumber == null) {
          continue;
        }

        const pageHighlights = finalConfig.highlights.filter((highlight) => {
          // Check if the highlight is on the current page via ID,
          // Skip if the highlight already exists
          let existingHighlight = document.getElementById(highlight.id);
          if (existingHighlight) {
            return false;
          }

          // Check the file ID
          const index = props.docs.findIndex((doc) => doc.uri == props.activeDocument?.uri);
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
  }, [pages]);

  useEffect(() => {
    let rects = [];

    // Determine the index of the active document
    const index = props.docs.findIndex((doc) => doc.uri == props.activeDocument?.uri);
    const file = props.files[index];
    setFileIndex(index);

    if (file == undefined) {
      return;
    }

    // Iterate through each highlight
    for (const high of finalConfig.highlights) {
      // Only parse the JSON if the file ID matches the active document
      if (high.fileId != file.id) {
        continue;
      }

      // Parse the JSON
      const datas = parsePrisma(high.rects);
      for (const data of datas) {
        rects.push(data);
      }
    }
  }, [finalConfig.highlights, docViewer]);

  const deselect = () => {
    // Deselect text after highlighting
    if (window.getSelection) {
      window?.getSelection()?.removeAllRanges();
    } else if (document.getSelection()) {
      // For IE
      document.getSelection()?.empty();
    }
  };

  const handlePDFLoad = debounce(() => {
    const pages = document.querySelectorAll(".react-pdf__Page");
    setPages(Array.from(pages));
  }, 100);

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

        let rectList: DOMRect[] = [];

        for (const [key, value] of Object.entries(rects)) {
          // Include scroll offsets in the position calculation
          value.x += window.scrollX;
          value.y += window.scrollY;

          rectList.push(value);
        }

        // Remove any rects that collide with each other
        let i = 0;
        while (i < rectList.length) {
          let j = i + 1;
          while (j < rectList.length) {
            // @ts-ignore
            if (
              // @ts-ignore
              rectList[i].y < rectList[j].y + rectList[j].height &&
              // @ts-ignore
              rectList[i].y + rectList[i].height > rectList[j].y
            ) {
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
        triggerActionLog({
          type: "selection",
          value: {
            text: selection.toString(),
            rects: rectList,
          },
        });
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
    }
  }, 200);

  async function onHighlight() {
    // Determine the index of the active document
    const index = props.docs.findIndex((doc) => doc.uri == props.activeDocument?.uri);

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

        // Convert rect back from absolute to viewport
        let x = rect.x - window.scrollX;
        let y = rect.y - window.scrollY;

        if (y >= pageRect.top && y <= pageRect.bottom) {
          let relativeRect = {
            page: page.getAttribute("data-page-number"),
            x: (x - pageRect.x) / pageRect.width,
            y: (y - pageRect.y) / pageRect.height,
            width: rect.width / pageRect.width,
            height: rect.height / pageRect.height,
          };
          relativeRects.push(relativeRect);
        }
      }
    }

    // If colliding with another highlight, delete the highlight
    for (const highlight of finalConfig.highlights) {
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
              height: rRect.height,
            };
            const r2 = {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            };
            if (
              r1.x < r2.x + r2.width &&
              r1.x + r1.width > r2.x &&
              r1.y < r2.y + r2.height &&
              r1.y + r1.height > r2.y
            ) {
              // Deselect
              deselect();

              // Remove the highlight from the state
              const newHighlights = finalConfig.highlights.filter(
                (h) => h.id != highlight.id,
              );
              finalConfig.setHighlights(newHighlights);

              // Remove the highlight from the DOM
              const highlightElements = document.querySelectorAll(
                `.highlight_${highlight.id}`,
              );
              for (const highlightElement of highlightElements) {
                highlightElement.remove();
              }

              // Delete the highlight from the database
              await deleteHighlight.mutateAsync({ id: highlight.id });

              // Log the information
              triggerActionLog({
                type: "dehighlight",
                value: { ...highlight },
              });
              return;
            }
          }
        }
      }
    }

    // Generate id
    const id = generateUUID();
    deselect();

    // Manually add the highligh to the children of the PDF Page it belongs to
    for (const rRect of relativeRects) {
      // @ts-ignore
      const page = pages[parseInt(rRect.page) - 1];
      if (page == undefined) {
        continue;
      }

      // Adding the highlight
      const highlightElement = document.createElement("div");
      highlightElement.className = `highlight_${id} absolute`;
      highlightElement.style.top = `${rRect.y * 100}%`;
      highlightElement.style.left = `${rRect.x * 100}%`;
      highlightElement.style.width = `${rRect.width * 100}%`;
      highlightElement.style.height = `${rRect.height * 100}%`;
      highlightElement.style.backgroundColor = "rgba(245, 161, 66, 0.5)";
      highlightElement.style.zIndex = "45";
      page.appendChild(highlightElement);
    }

    // Create a highlight via mutation and add it
    const highlight = await createHighlight.mutateAsync({
      id: id,
      rects: JSON.stringify(relativeRects),
      content: toolkitText,
      fileId: file.id,
      activityDataId: finalConfig.activityDataId,
    });
    finalConfig.setHighlights([...finalConfig.highlights, highlight]);

    // Log the information
    triggerActionLog({ type: "highlight", value: { ...highlight } });
  }

  async function onAnnotate() {
    // Determine the index of the active document
    const index = props.docs.findIndex((doc) => doc.uri == props.activeDocument?.uri);

    // Get the file ID (matching the index of the file)
    const file = props.files[index];
    if (file == undefined) {
      return;
    }

    // Get the first rect
    const rect = toolkitRects[0];

    if (rect == undefined) {
      return;
    }

    // Obtain relative position of the annotation
    let rRect = {
      page: "",
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
    };
    for (const page of pages) {
      const pageRect = page.getBoundingClientRect();

      // Convert rect back from absolute to viewport
      let x = rect.x - window.scrollX;
      let y = rect.y - window.scrollY;

      if (y >= pageRect.top && y <= pageRect.bottom) {
        rRect = {
          page: page.getAttribute("data-page-number") || "",
          x: (x - pageRect.x) / pageRect.width,
          y: (y - pageRect.y) / pageRect.height,
          width: rect.width / pageRect.width,
          height: rect.height / pageRect.height,
        };
      }
    }

    // Get the page
    const page = pages[parseInt(rRect.page) - 1];
    if (page == undefined) {
      return;
    }

    // Generate id
    const id = generateUUID();
    deselect();

    // Create an annotation via mutation and add it
    const annotation = await createAnnotation.mutateAsync({
      id: id,
      position: JSON.stringify(rRect),
      content: "",
      fileId: file.id,
      activityDataId: finalConfig.activityDataId,
    });
    finalConfig.setAnnotations([...finalConfig.annotations, annotation]);

    triggerActionLog({
      type: "annotate",
      value: { ...annotation },
    });

  }

  async function onLookup() {

    deselect();

    // Firest strip all the whitespaces on the edges
    const trimmedToolkitText = toolkitText.trim();

    // First, check if the text is a word (no whitespaces)
    if (/\s/g.test(trimmedToolkitText) || trimmedToolkitText.length <= 1) {
      setDictError("Please select a word to lookup");
      triggerActionLog({
        type: "dictionaryLookUP",
        value: { error: "Please select a word to lookup" },
      });
      return;
    }

    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en_US/${trimmedToolkitText}`);
    const data = await response.json();

    console.log(data)

    // Check if the word exists
    if (!Array.isArray(data)){
      setDictError("The word does not exist in the dictionary");
      triggerActionLog({
        type: "dictionaryLookUP",
        value: { selection: trimmedToolkitText, error: "The word does not exist in the dictionary" },
      });
      return;
    } else {
      setDictEntry(data);
      triggerActionLog({
        type: "dictionaryLookUP",
        value: { selection: trimmedToolkitText, word: data[0].word },
      });
    }
  }

  return (
    <>
      {finalConfig.toolkit &&
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
      }

      {props.docs.length > 1 &&
        <DocumentDrawer
          files={props.files}
          docs={props.docs}
          activeDocument={props.activeDocument}
          setActiveDocument={props.setActiveDocument}
        />
      }
      {error && <div className="text-red-500">{error}</div>}

      <div
        id="pdf-viewer-container"
        className={`flex h-full w-full flex-row items-center justify-center ${finalConfig.blur ? "blur-lg" : ""}`}
      >
        {docViewer}
      </div>

      {pages && (
        <>
          {finalConfig.toolkit && 
            <>
              {pages.map((page, index) => (
                <PageNoteAnnotationLayer
                  key={index}
                  fileIndex={fileIndex}
                  files={props.files}
                  page={page}
                  annotations={finalConfig.annotations}
                  setAnnotations={finalConfig.setAnnotations}
                />
              ))}
            </>
          }

          {finalConfig.btnLayer && 
            <>
              {pages.map((page, index) => (
                <PageBtnLayer
                  key={index}
                  page={page}
                  component={finalConfig.component}
                />
              ))}
            </>
          }

          {props.children &&
            <>
              {pages.map((page, index) => (
                <>
                  {renderChildren(props.children, page, index)}
                </>
              ))}
            </>
          }

        </>
      )}

      <div className="toast toast-end z-[100] w-3/12">
        {dictError &&
        <div className="alert alert-error flex flex-row justify-between">
          <span>{dictError}</span>
          <button className="btn btn-ghost" onClick={() => setDictError("")}>Dismiss</button>
        </div>
        }

        {dictEntry &&
          <DictionaryEntry dictEntry={dictEntry} setDictEntry={setDictEntry}/>
        }
      </div>
    </>
  );
}
