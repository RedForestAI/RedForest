import ReactDOM from "react-dom"
import { Annotation } from "@prisma/client"
import { useState, useEffect } from "react"
import { parsePrisma } from "~/utils/prisma";
import { api } from "~/trpc/react";

import "./annotation-box.css"

const dRatio = 0.25
const wRatio = 0.95

type AnnotationBoxProps = {
  id: string
  rRect: {page: string | null, x: number, y: number, width: number, height: number}
  page: Element
}

export function addAnnotationBox(props: AnnotationBoxProps) {

  // Get the page element
  const page = props.page

  // Check if the page already has an annotation layer (id = "noteAnnotationLayer")
  let noteAnnotationLayer = document.getElementById("noteAnnotationLayer")

  // If the page does not have an annotation layer, create one
  if (noteAnnotationLayer == null) {
    noteAnnotationLayer = document.createElement('div')
    noteAnnotationLayer.id = "noteAnnotationLayer"
    page.appendChild(noteAnnotationLayer)
  }

  // Now, let's fetch the current annotation containers in the page
  const annotationContainers  = page.querySelectorAll(".annotation-container")

  // Get the page element and the new incoming annotation
  const rect = props.page.getBoundingClientRect()
  const newAnnotationRect = {
    top: props.rRect.y * 100,
    bottom: props.rRect.y * 100 + rect.width * 0.04,
  }

  // Check if any of the annotationContainers would overalp with the new annotation, purely from the y-axis
  let collidingContainer: Element | null = null;
  for (const annotationContainer of annotationContainers) {
    const annotationContainerRect = annotationContainer.getBoundingClientRect()

    // Check if the new annotation would overlap with the current annotationContainer
    if (newAnnotationRect.top < annotationContainerRect.bottom && newAnnotationRect.bottom > annotationContainerRect.top) {
      // If it does, then we will move the new annotation to the right of the current annotationContainer
      collidingContainer = annotationContainer
    }
  }

  // If collision, just add the new annotation to colliding container (as it behaves lie a stack)
  if (collidingContainer) {
    ReactDOM.render(<AnnotationBox {...props}/>, collidingContainer)
  } else {
    // If no collision, create a new annotation container
    const annotationContainer = document.createElement('div')
    annotationContainer.className = "annotation-container"
    annotationContainer.style.position = "absolute"
    annotationContainer.style.top = `${props.rRect.y * 100 - 2}%`
    annotationContainer.style.left = `${rect.width * -dRatio}px`
    annotationContainer.style.width = `${rect.width * dRatio}px`
    annotationContainer.style.minHeight = "52px"
    annotationContainer.style.zIndex = "50"
    annotationContainer.style.display = "flex"
    annotationContainer.style.flexDirection = "column"
    annotationContainer.setAttribute("pointer-events", "auto")
    noteAnnotationLayer.appendChild(annotationContainer)

    ReactDOM.render(<AnnotationBox {...props}/>, annotationContainer)
  }
}

function AnnotationBox(props: AnnotationBoxProps) {
  const [highlight, setHighlight] = useState(false);

  // Mutations
  // const deleteAnnotation = api.annotation.delete.useMutation();

  // Get the page element
  const rect = props.page.getBoundingClientRect()
  console.log(rect, props.rRect)

  useEffect(() => {
    document.addEventListener('click', function(e) {
      console.log(e.target); // Log the element that was clicked
    }, true); // Use capture to ensure the event is captured during the capturing phase
    
  }, [])

  async function deleteSelf() {
    console.log("Delete annotation")
    
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
            stroke-width="10"
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