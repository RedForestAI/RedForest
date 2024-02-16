import ReactDOM from "react-dom"
import { Annotation } from "@prisma/client"
import { useState, useEffect } from "react"
import { parsePrisma } from "~/utils/prisma";
import { api } from "~/trpc/react";

type AnnotationBoxProps = {
  id: string
  rRect: {page: string | null, x: number, y: number, width: number, height: number}
  page: Element
}

export function addAnnotationBox(props: AnnotationBoxProps) {

  // Get the page element
  const page = props.page
  console.log(page)

  // Create a new div element and append it to the page
  const annotationLayer = document.createElement('div')
  page.appendChild(annotationLayer)

  ReactDOM.render(<AnnotationBox {...props}/>, annotationLayer)
}

function AnnotationBox(props: AnnotationBoxProps) {

  // Mutations
  // const deleteAnnotation = api.annotation.delete.useMutation();

  // Get the page element
  const rect = props.page.getBoundingClientRect()

  async function deleteSelf() {
    console.log("Delete annotation")
    
    // First delete from the DOM
    const annotation = document.querySelector(`.annotation_${props.id}`)
    annotation?.remove()

    // Then delete from the database

  }

  return (
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
        <textarea className="textarea textarea-bordered h-24" placeholder="Your notes"></textarea>
     </label>
    </div>
  )
}