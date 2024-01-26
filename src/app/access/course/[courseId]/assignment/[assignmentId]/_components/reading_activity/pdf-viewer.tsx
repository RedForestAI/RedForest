import React, { useRef, useState, useEffect, useContext } from 'react';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import { useNavBarContext } from '~/providers/navbar-provider';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./pdf-viewer.css"

export default function PDFViewer() {
  const { setNavBarContent } = useContext(useNavBarContext);
  const docViewerRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1); // Starting zoom level

  useEffect(() => {
    // Define the content you want to add to the navbar
    const navBarExtras = (
      <div className="flex flex-row gap-2 items-center ">
        <button className="btn btn-ghost" onClick={() => setZoomLevel((prev) => (prev-0.1))}>-</button>
          <FontAwesomeIcon icon={faMagnifyingGlass}/>
        <button className="btn btn-ghost" onClick={() => setZoomLevel((prev) => (prev+0.1))}>+</button>
      </div>
    );

    // Update the navbar content
    setNavBarContent(navBarExtras);

    // Reset the navbar content when the component unmounts
    return () => setNavBarContent(null);
  }, []);

  const docs = [
    { uri: "https://arxiv.org/pdf/1708.08021.pdf" } // Remote file
  ];

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