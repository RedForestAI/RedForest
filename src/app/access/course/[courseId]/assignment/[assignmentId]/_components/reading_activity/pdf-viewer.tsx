import { ReadingFile } from '@prisma/client'
import React, { useRef, useState, useEffect, useContext } from 'react';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import { useNavBarContext } from '~/providers/navbar-provider';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import "./pdf-viewer.css"
import { set } from 'zod';

export default function PDFViewer(props: {files: ReadingFile[]}) {
  const supabase = createClientComponentClient();
  const [ docs, setDocs ] = useState<{uri: string}[]>([]);
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

  useEffect(() => {

    // If there are no files, return
    if (props.files == undefined || props.files.length == 0) {
      return;
    }

    // Get the public URLs for the files
    const filepaths = props.files.map((file) => file.filepath);

    // For each file, get the public URL
    let urls: string[] = []
    for (let i = 0; i < filepaths.length; i++) {
      const { data: {publicUrl} } = supabase.storage.from('activity_reading_file').getPublicUrl(filepaths[i]!); 
      console.log(publicUrl)
      urls.push(publicUrl);
    }

    if (urls.length == 0) {
      console.log(urls);
      return;
    }

    // Iterate through the files and add them to the docs array
    const newDocs = urls.map((url: any) => {
      return {
        uri: url
      }
    });
    setDocs(newDocs);

  }, [props.files])

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