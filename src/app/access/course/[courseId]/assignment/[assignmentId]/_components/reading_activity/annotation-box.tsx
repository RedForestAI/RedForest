import { Annotation } from "@prisma/client"
import { useState, useEffect } from "react"
import { parsePrisma } from "~/utils/prisma";

type AnnotationBoxProps = {
  id: string
  rRect: {page: string | null, x: number, y: number, width: number, height: number}
  page: Element
}

export function addAnnotationBox(props: AnnotationBoxProps) {

    // Get the page element
    const rect = props.page.getBoundingClientRect()

    // Define the HTML structure as a template string
    const annotationHTML = `
      <div class="annotation_${props.id} absolute" style="
          top: ${props.rRect.y * 100}%;
          left: ${-rect.width * 0.025}%;
          min-width: ${rect.width * 0.25}px;
          min-height: 50px;
          padding: 10px;
          background-color: rgba(76, 175, 80, 0.9);
          color: #FFFFFF;
          z-index: 45;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      ">
        <button class="close-btn" style="
            position: absolute;
            top: 10px;
            right: 10px;
            background: transparent;
            border: none;
            color: #FFFFFF;
        ">X</button>
      </div>
    `;

    const labelHTML = `
      <div class="annotation_${props.id} absolute" style="
          top: ${(props.rRect.y - props.rRect.height) * 100}%;
          left: ${(props.rRect.x + (props.rRect.width*0.5)) * 100 - rect.width*0.002}%;
          min-width: ${rect.width * 0.04}px;
          min-height: 50px;
          padding: 10px;
          z-index: 45;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H288V368c0-26.5 21.5-48 48-48H448V96c0-35.3-28.7-64-64-64H64zM448 352H402.7 336c-8.8 0-16 7.2-16 16v66.7V480l32-32 64-64 32-32z"/></svg>
      </div>
    `;

    // Convert the HTML string to DOM elements
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = annotationHTML.trim();
    const tempDiv2 = document.createElement('div');
    tempDiv2.innerHTML = labelHTML.trim();

    // Extract the annotation element from the temp div
    const annotationElement = tempDiv.firstChild;
    const labelElement = tempDiv2.firstChild;

    // Append the close button event listener
    // @ts-ignore
    annotationElement!.querySelector('.close-btn').addEventListener('click', () => {
        annotationElement!.remove();
        labelElement!.remove();
    });

    // Append the annotation box to the page
    props.page.appendChild(annotationElement!);
    props.page.appendChild(labelElement!);

}