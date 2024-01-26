import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

import './pdf-viewer.css';

export default function PDFViewer() {

  const docs = [
    { uri: "https://arxiv.org/pdf/1708.08021.pdf" }, // Remote file
  ];

  return (
    <DocViewer
          style={{ width: "70%", height: "70%" }}
          documents={docs} 
          pluginRenderers={DocViewerRenderers}
          config={{
            header: {
              disableHeader: true,
              disableFileName: true,
              retainURLParams: true
            },
            pdfVerticalScrollByDefault: true,
            pdfZoom: {
              defaultZoom: 1,
              zoomJump: 0.1
            }
          }}
        />
    );
};

