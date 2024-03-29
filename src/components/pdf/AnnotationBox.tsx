import ReactDOM from "react-dom";
import { Annotation, ReadingFile } from "@prisma/client";
import { useState, useEffect } from "react";
import { parsePrisma } from "~/utils/prisma";
import { api } from "~/trpc/react";
import { generateUUID } from "~/utils/uuid";
import { useHighlight } from '~/providers/HighlightProvider';
import { triggerActionLog } from "~/loggers/ActionsLogger";

import { faClose, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./AnnotationBox.css";

const dRatio = 0.25;
const wRatio = 0.95;
const aHeight = 0.1; // Annotation Height
const rangeMargin = 0.1;

type aContainerType = {
  id: string;
  page: Element;
  annotations: Annotation[];
};

type PageNoteAnnotationLayerProps = {
  fileIndex: number;
  files: ReadingFile[];
  page: Element;
  annotations: Annotation[];
  setAnnotations: any;
};

type AnnotationContainerProps = {
  container: aContainerType;
  rect: DOMRect;
  page: Element;
  setAnnotations: any;
};

type AnnotationBoxProps = {
  annotation: Annotation;
  rRect: {
    page: string | null;
    x: number;
    y: number;
    width: number;
    height: number;
  };
  page: Element;
  setAnnotations: any;
};

export function PageNoteAnnotationLayer(props: PageNoteAnnotationLayerProps) {
  // Containers for the annotations
  const [aContainers, setAContainers] = useState<aContainerType[]>([]);

  // Get the page number
  const pageNumber = props.page.getAttribute("data-page-number");
  const rect = props.page.getBoundingClientRect();

  function detectCollision(
    container: aContainerType,
    aRange: { top: number; bottom: number },
  ): aContainerType | null {
    // For each container, go through all annotations and compute a range
    let top = 100;
    let bottom = 0;
    for (const annotation of container.annotations) {
      const rRect = parsePrisma(annotation.position);
      if (rRect.y < top) top = rRect.y;
      if (rRect.y + aHeight > bottom) bottom = rRect.y + aHeight;
    }
    const cRange = { top: top-rangeMargin, bottom: bottom+rangeMargin };

    // console.log("New annotation rect", aRange)
    // console.log("Annotation container rect", cRange)

    // Check if the new annotation would overlap with the current a container
    if (aRange.top < cRange.bottom && aRange.bottom > cRange.top) {
      return container;
    }

    return null;
  }

  useEffect(() => {

    // Get the file ID (matching the index of the file)
    const file = props.files[props.fileIndex];
    if (file == undefined) {
      return;
    }

    // Filter the annotations to only include the ones on the current page
    const annotations = props.annotations.filter(
      (annotation) => parsePrisma(annotation.position).page === pageNumber && annotation.fileId === file.id,
    );

    // Create list of new containts
    let newContainerList: aContainerType[] = [];

    // Aggregate the annotations into annotation containers
    for (const annotation of annotations) {
      const rRect = parsePrisma(annotation.position);
      const aRange = {
        top: rRect.y,
        bottom: rRect.y + 0.1,
      };

      // Check against annotation containers
      let collidingContainer: aContainerType | null = null;
      for (const annotationContainer of newContainerList) {
        collidingContainer = detectCollision(
          annotationContainer,
          aRange,
        );
        if (collidingContainer) break;
      }

      // If collision, just add the new annotation to colliding container (as it behaves lie a stack)
      if (collidingContainer) {
        // console.log("Colliding container");
        collidingContainer.annotations.push(annotation);
      } else {
        // If no collision, create a new annotation container
        // console.log("No colliding container");

        const newContainer: aContainerType = {
          id: generateUUID(),
          page: props.page,
          annotations: [annotation],
        };
        newContainerList.push(newContainer);
      }
    }

    // Update the state, by adding the new containers to the old ones
    setAContainers(newContainerList);
  }, [props.annotations, props.fileIndex]);

  return ReactDOM.createPortal(
    <div
      id={`noteAnnotationLayer_${pageNumber}`}
      className="absolute left-0 top-0 h-full w-full"
    >
      {/* Text annotation */}
      {aContainers.map((container) => (
        <AnnotationContainer
          key={container.id}
          container={container}
          rect={rect}
          page={props.page}
          setAnnotations={props.setAnnotations}
        />
      ))}

      {/* Sticky note */}
      {props.annotations
        .filter(
          (annotation) =>
            parsePrisma(annotation.position).page === pageNumber &&
            annotation.fileId === props.files[props.fileIndex]!.id,
        )
        .map((annotation) => (
          <AnnotationStickyNote
            key={annotation.id}
            annotation={annotation}
            rRect={parsePrisma(annotation.position)}
            page={props.page}
            setAnnotations={props.setAnnotations}
          />
        ))}
    </div>,
    props.page,
  );
}

function AnnotationContainer(props: AnnotationContainerProps) {
  function getTop() {
    // Get the highest annotation in the container
    let tops = [];
    for (const annotation of props.container.annotations) {
      const rRect = parsePrisma(annotation.position);
      tops.push(rRect.y);
    }

    if (tops.length > 0) {
      return `${Math.min(...tops) * 100}%`;
    }
    return "0%";
  }

  return (
    <div
      id={`annotation-container_${props.container.id}`}
      style={{
        position: "absolute",
        top: getTop(),
        left: `${props.rect.width * -dRatio}px`,
        width: `${props.rect.width * dRatio}px`,
        minHeight: `${aHeight * 100}%`,
        zIndex: "50",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {props.container.annotations.map((annotation) => (
        <AnnotationBox
          key={annotation.id}
          annotation={annotation}
          rRect={parsePrisma(annotation.position)}
          page={props.page}
          setAnnotations={props.setAnnotations}
        />
      ))}
    </div>
  );
}

function AnnotationBox(props: AnnotationBoxProps) {
  const [content, setContent] = useState<string>(props.annotation.content);
  const { highlightedId } = useHighlight();
  const isHighlighted = props.annotation.id === highlightedId;

  // Mutations
  const deleteAnnotation = api.annotation.delete.useMutation();
  const updateAnnotation = api.annotation.update.useMutation();

  // Get the page element
  const rect = props.page.getBoundingClientRect();

  async function deleteSelf() {
    // First delete from the DOM
    props.setAnnotations((prev: Annotation[]) =>
      prev.filter((annotation: Annotation) => annotation.id !== props.annotation.id),
    );

    // Then delete from the database
    await deleteAnnotation.mutateAsync({ id: props.annotation.id });

    triggerActionLog({
      type: "deannotate",
      value: { ...props.annotation },
    });
  }

  function updateOfflineContent(e: any) {
    setContent(e.target.value);
  }

  async function updateOnlineContent(e: any) {
    e.preventDefault();

    // Update the annotation in the state
    props.setAnnotations((prev: Annotation[]) =>
      prev.map((annotation: Annotation) =>
        annotation.id === props.annotation.id
          ? { ...annotation, content: content }
          : annotation,
      ),
    );

    // Update the annotation in the database
    await updateAnnotation.mutateAsync({ id: props.annotation.id, content: content });

    triggerActionLog({
      type: "editAnnotation",
      value: { ...props.annotation, content: content },
    });
  }

  return (
    <>
      {/* Left-Panel Note */}
      <div
        id={`annotation_${props.annotation.id}`}
        className={`annotation-box annotation_${props.annotation.id} bg-base-100`}
        style={{
          width: `${rect.width * dRatio * wRatio}px`,
          zIndex: "45",
        }}
      >
        <div>
          <div className="label">
            <span className="label-text w-full">@You</span>
            <span className="label-text-alt flex flex-row">
              <button className="btn btn-ghost btn-xs" disabled={content == props.annotation.content} onClick={updateOnlineContent}>
                <FontAwesomeIcon icon={faSave} className="fa-s" />
              </button>
              <button className="btn btn-ghost btn-xs" onClick={deleteSelf}>
                <FontAwesomeIcon icon={faClose} className="fa-s" />
              </button>
            </span>
          </div>
          <textarea
            className={`textarea textarea-bordered textarea-primary h-24 w-full ${isHighlighted ? "textarea-highlight" : ""}`}
            placeholder="Your notes"
            value={content}
            onChange={updateOfflineContent}
          ></textarea>
        </div>
      </div>
    </>
  );
}

function AnnotationStickyNote(props: AnnotationBoxProps) {
  const { setHighlightedId } = useHighlight();

  function highlightAnnotation() {
    setHighlightedId(props.annotation.id); // Highlight this note
    setTimeout(() => setHighlightedId(''), 1000); // Remove highlight after 1 second
  }

  // Get the page element
  const rect = props.page.getBoundingClientRect();

  return (
    <>
      <div
        className={`annotation_${props.annotation.id} absolute p-1`}
        style={{
          top: `${props.rRect.y*100 - 2.5}%`,
          left: `${(props.rRect.x + props.rRect.width/2)*100 - 2}%`,
          width: `${4}%`,
          height: `${rect.width * 0.04}px`,
          zIndex: "50",
        }}
      >
        <button className="h-full w-full" onClick={highlightAnnotation}>
          <svg
            fill="#ffff88"
            opacity="0.9"
            stroke="black"
            strokeWidth="10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H288V368c0-26.5 21.5-48 48-48H448V96c0-35.3-28.7-64-64-64H64zM448 352H402.7 336c-8.8 0-16 7.2-16 16v66.7V480l32-32 64-64 32-32z" />
          </svg>
        </button>
      </div>
    </>
  )
}
