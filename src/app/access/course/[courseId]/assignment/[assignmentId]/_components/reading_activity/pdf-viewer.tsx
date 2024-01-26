"use client";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export default function PDFViewer(props: {file: string}) {
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [pageWidth, setPageWidth] = useState(0);
  const [scale, setScale] = useState(1.0);

  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: {
    numPages: number;
  }) {
    setNumPages(nextNumPages);
  }

  function onPageLoadSuccess() {
    setPageWidth(window.innerWidth);
    setLoading(false);
  }

  const options = {
    cMapUrl: "cmaps/",
    cMapPacked: true,
    standardFontDataUrl: "standard_fonts/",
  };

  return (
    <>
      <div
        hidden={loading}
        style={{ height: "calc(100vh - 64px)" }}
        className="flex items-center"
      >
        <div className="h-full flex justify-center mx-auto">
          <Document
            file={props.file}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={console.error}
            options={options}
            renderMode="canvas"
            className=""
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
              className="mb-4"
              key={`page_${index + 1}`}
              pageNumber={index+1}
              renderAnnotationLayer={true}
              renderTextLayer={true}
              onLoadSuccess={onPageLoadSuccess}
              onRenderError={() => setLoading(false)}
              width={Math.max(pageWidth * 0.5, 390)}
              scale={scale}
            />
            ))}
          </Document>
        </div>
      </div>
    </>
  );
}