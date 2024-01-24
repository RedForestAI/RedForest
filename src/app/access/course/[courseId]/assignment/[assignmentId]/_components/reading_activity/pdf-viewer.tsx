"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

type PDFViewerProps = {
  file: string;
};

export default function PDFViewer(props: PDFViewerProps) {
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


  useEffect(() => {
    const handleKeydown = (e: any) => {
      if (
        e.ctrlKey &&
        (e.keyCode == "61" ||
          e.keyCode == "107" ||
          e.keyCode == "173" ||
          e.keyCode == "109" ||
          e.keyCode == "187" ||
          e.keyCode == "189")
      ) {
        e.preventDefault();
      }
    };

    const handleWheel = (e: any) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

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
              renderTextLayer={false}
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
