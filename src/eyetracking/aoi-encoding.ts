
type AOIInfo = {
  aoiType: string;
  aoiInfo: string;
  rX: number;
  rY: number;
}

function relativeCoordinates(x: number, y: number, element: Element): [number, number] {
  const rect = element.getBoundingClientRect();
  return [(x - rect.left) / rect.width, (y - rect.top) / rect.height];
}

/**
 * Encodes the given x and y coordinates into an AOI.
 * @param x The x coordinate in px.
 * @param y The y coordinate in px.
 */
export function AOIEncoding(x: number, y: number): AOIInfo | null {

  const elements = document.elementsFromPoint(x, y);

  // Look for the dictionary entry
  let dictionaryEntry = elements.find((el) => el.id === 'dictionaryEntry');
  if (dictionaryEntry) {
      
      // Convert the absolute XY to relative XY within the dictionary entry
      const [relativeX, relativeY] = relativeCoordinates(x, y, dictionaryEntry);
  
      return {
        aoiType: 'DictionaryEntry',
        aoiInfo: "",
        rX: relativeX,
        rY: relativeY
      }
    }

  // Look for PDF Page
  let pdfPage = elements.find((el) => el.className === 'react-pdf__Page');
  if (pdfPage) {

    // Convert the absolute XY to relative XY within the PDF Page
    const [relativeX, relativeY] = relativeCoordinates(x, y, pdfPage);

    return {
      aoiType: 'PDFPage',
      aoiInfo: pdfPage.getAttribute('data-page-number')?.toString() || "",
      rX: relativeX,
      rY: relativeY
    }
  }

  // Look for the QuestionPane
  let questionPane = elements.find((el) => el.id === 'QuestionPane');
  if (questionPane) {

    // Convert the absolute XY to relative XY within the QuestionPane
    const [relativeX, relativeY] = relativeCoordinates(x, y, questionPane);

    return {
      aoiType: 'QuestionPane',
      aoiInfo: "",
      rX: relativeX,
      rY: relativeY
    }
  }

  // Look for the DocumentPane
  let documentPane = elements.find((el) => el.id === 'DocumentPane');
  if (documentPane) {

    // Convert the absolute XY to relative XY within the DocumentPane
    const [relativeX, relativeY] = relativeCoordinates(x, y, documentPane);

    return {
      aoiType: 'DocumentPane',
      aoiInfo: "",
      rX: relativeX,
      rY: relativeY
    }
  }

  // Look for annotation boxes 
  let annotationBox = elements.find((el) => el.classList.contains('annotation-box'));
  if (annotationBox) {

    // Convert the absolute XY to relative XY within the annotation box
    const [relativeX, relativeY] = relativeCoordinates(x, y, annotationBox);

    return {
      aoiType: 'AnnotationBox',
      aoiInfo: annotationBox.getAttribute("id") || "",
      rX: relativeX,
      rY: relativeY
    }
  }

  return null;
}