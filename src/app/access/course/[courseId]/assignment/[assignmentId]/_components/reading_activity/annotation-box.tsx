import ReactDOM from "react-dom"
import { LegacyRef } from "react";
import { Annotation } from "@prisma/client"
import { useState, useEffect } from "react"
import { parsePrisma } from "~/utils/prisma";
import { api } from "~/trpc/react";
import { generateUUID } from "~/utils/uuid";

import "./annotation-box.css"

const dRatio = 0.25
const wRatio = 0.95

type AnnotationBoxProps = {
  id: string
  rRect: {page: string | null, x: number, y: number, width: number, height: number}
  page: Element
}

type aContainerType = {
  id: string
  page: Element
  annotations: Annotation[]
  reference: LegacyRef<HTMLDivElement> | undefined
}

type PageNoteAnnotationLayerProps = {
  page: Element
  annotations: Annotation[]
}

type AnnotationContainerProps = {
  container: aContainerType
  rect: DOMRect
  page: Element
}

export function PageNoteAnnotationLayer(props: PageNoteAnnotationLayerProps) {
  // Containers for the annotations
  const [aContainers, setAContainers] = useState<aContainerType[]>([])

  // Get the page number
  const pageNumber = props.page.getAttribute("data-page-number")
  const rect = props.page.getBoundingClientRect()

  function detectCollision(container: aContainerType, annotation: Annotation, aRect: {top: number, bottom: number}): aContainerType | null {

    // @ts-ignore
    const element = container.reference?.current
    if (!element) return null
    const cRect = element.getBoundingClientRect()

    // Update the container rect to be relative to the page
    cRect.y = cRect.y - rect.y

    console.log("New annotation rect", aRect)
    console.log("Annotation container rect", cRect)

    // Check if the new annotation would overlap with the current a container
    if (aRect.top < cRect.bottom && aRect.bottom > cRect.top) {
      return container
    }

    return null
  }

  useEffect(() => {
    // Filter the annotations to only include the ones on the current page
    const annotations = props.annotations.filter(annotation => parsePrisma(annotation.position).page === pageNumber)
    console.log(annotations)

    // Create list of new containts
    let newContainerList: aContainerType[] = []

    // Aggregate the annotations into annotation containers
    for (const annotation of annotations) {
      const rRect = parsePrisma(annotation.position)
      const newAnnotationRect = {
        top: rRect.y * rect.height,
        bottom: rRect.y * rect.height + 52,
      }

      // Check against annotation containers
      let collidingContainer: aContainerType | null = null;
      for (const annotationContainer of newContainerList) {
        collidingContainer = detectCollision(annotationContainer, annotation, newAnnotationRect)
        if (collidingContainer) break
      }

      // If collision, just add the new annotation to colliding container (as it behaves lie a stack)
      if (collidingContainer) {
        console.log("Colliding container")
        // ReactDOM.render(<AnnotationBox {...props}/>, collidingContainer)
      } else {
        // If no collision, create a new annotation container
        console.log("No colliding container")

        const newContainer: aContainerType = {
          id: generateUUID(),
          page: props.page,
          annotations: [annotation],
          reference: undefined
        }
        newContainerList.push(newContainer)
      }
    }

    // Update the state, by adding the new containers to the old ones
    setAContainers(newContainerList)

  }, [props.annotations])

  return ReactDOM.createPortal(
    <div id={`noteAnnotationLayer_${pageNumber}`} className="absolute top-0 left-0 w-full h-full">
      {aContainers.map((container, index) => (
        <div key={index}>
          <AnnotationContainer container={container} rect={rect} page={props.page}/>
        </div>
      ))}
    </div>, 
    props.page
  )
}

export function AnnotationContainer(props: AnnotationContainerProps) {

  function getTop() {
    // Get the highest annotation in the container
    let tops = []
    for (const annotation of props.container.annotations) {
      const rRect = parsePrisma(annotation.position)
      tops.push(rRect.y)
    }

    if (tops.length > 0) {
      return `${Math.min(...tops) * 100 - 2}%`
    } 
    return "0%"
  }

  return (
    <div ref={props.container.reference} className="annotation-container" style={{
      position: "absolute",
      top: getTop(),
      left: `${props.rect.width * -dRatio}px`,
      width: `${props.rect.width * dRatio}px`,
      minHeight: "52px",
      zIndex: "50",
      display: "flex",
      flexDirection: "column",
    }}>
      {props.container.annotations.map((annotation, index) => (
        <div key={index}>

        <AnnotationBox 
          id={props.container.id}
          rRect={parsePrisma(annotation.position)}
          page={props.page}
        />
        </div>
      ))}
    </div>
  )
}

function AnnotationBox(props: AnnotationBoxProps) {
  const [highlight, setHighlight] = useState(false);

  // Mutations
  // const deleteAnnotation = api.annotation.delete.useMutation();

  // Get the page element
  const rect = props.page.getBoundingClientRect()

  async function deleteSelf() {
    
    // First delete from the DOM
    const annotations = document.querySelectorAll(`.annotation_${props.id}`)
    for (const annotation of annotations) annotation.remove()

    // Then delete from the database

  }

  function highlightAnnotation() {
    console.log("Highlight annotation");
    setHighlight(true);
    setTimeout(() => setHighlight(false), 1000); // Remove highlight after 1 second
  }

  return (
    <>

      {/* Sticky Note Icon */}
      <div className={`annotation_${props.id} absolute p-1`} 
        style={{
          top: `${-rect.height * 0.01}px`,
          left: `${rect.width * dRatio + (rect.width * (props.rRect.x + props.rRect.width/2)) - rect.width * 0.02}px`,
          width: `${rect.width * 0.04}px`,
          height: `${rect.width * 0.04}px`,
          zIndex: "50",
      }}>
        <button className="w-full h-full" onClick={highlightAnnotation}>
          <svg 
            fill="#ffff88"
            stroke="black"
            strokeWidth="10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512">
              <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H288V368c0-26.5 21.5-48 48-48H448V96c0-35.3-28.7-64-64-64H64zM448 352H402.7 336c-8.8 0-16 7.2-16 16v66.7V480l32-32 64-64 32-32z"/>
          </svg>
        </button>
      </div>


      {/* Left-Panel Note */}
      <div className={`annotation_${props.id} bg-base-100 h-52`} style={{
        width: `${rect.width * dRatio * wRatio}px`,
        zIndex: "45",
      }}>
        <label className="form-control">
          <div className="label">
            <span className="label-text">@You</span>
            <span className="label-text-alt">
              <button className="btn btn-xs btn-ghost" onClick={deleteSelf}>X</button>
            </span>
          </div>
          <textarea className={`textarea textarea-primary textarea-bordered h-24 ${highlight ? 'textarea-highlight' : ''}`} placeholder="Your notes"></textarea>
      </label>
      </div>
    </>
  )
}