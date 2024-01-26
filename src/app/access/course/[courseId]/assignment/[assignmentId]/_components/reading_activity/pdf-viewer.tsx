import React, { useRef, useState, useEffect } from 'react';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

import "./pdf-viewer.css";

export default function PDFViewer() {
  const docViewerRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1); // Starting zoom level

  const docs = [
    { uri: "https://arxiv.org/pdf/1708.08021.pdf" } // Remote file
  ];

  const handleZoom = (e: any) => {
    if (e.ctrlKey) {
      e.preventDefault(); // Prevent whole page zoom
      const zoomJump = e.deltaY > 0 ? 0.1 : -0.1; // Adjust zoom factor as needed
      setZoomLevel((prevZoomLevel) => prevZoomLevel + zoomJump);
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", handleZoom, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleZoom);
    };
  }, []);

  return (
      <DocViewer
        documents={docs}
        pluginRenderers={DocViewerRenderers}
        style={{ width: `${70*zoomLevel}%`, height: `100%` }}
        config={{
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
      />
  );
};
