import ReactDOM from "react-dom"
import { Annotation } from "@prisma/client"
import { useState, useEffect } from "react"
import { parsePrisma } from "~/utils/prisma";
import { api } from "~/trpc/react";

import "./annotation-box.css"

type AnnotationBoxProps = {
  id: string
  rRect: {page: string | null, x: number, y: number, width: number, height: number}
  page: Element
}

export function addAnnotationBox(props: AnnotationBoxProps) {

  // Get the page element
  const page = props.page

  // Create a new div element and append it to the page
  const annotationLayer = document.createElement('div')
  page.appendChild(annotationLayer)

  ReactDOM.render(<AnnotationBox {...props}/>, annotationLayer)
}

function AnnotationBox(props: AnnotationBoxProps) {
  const [highlight, setHighlight] = useState(false);

  // Mutations
  // const deleteAnnotation = api.annotation.delete.useMutation();

  // Get the page element
  const rect = props.page.getBoundingClientRect()

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
      <div className={`annotation_${props.id} absolute p-2`} 
        style={{
          top: `${(props.rRect.y - props.rRect.height) * 100}%`,
          left: `${(props.rRect.x + (props.rRect.width*0.5)) * 100 - rect.width*0.002}%`,
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


      <div className={`annotation_${props.id} absolute bg-base-100 h-52`} style={{
        top: `${props.rRect.y * 100}%`,
        left: `${rect.width * -0.25 - 10}px`,
        width: `${rect.width * 0.25}px`,
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