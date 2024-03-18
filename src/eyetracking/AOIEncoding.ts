
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

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (!element) {
      continue;
    }
    if (['dictionaryEntry', 'QuestionPane', 'DocumentPane', 'annotation-box', 'reading-instr-modal'].includes(element.id)) {
      const [relativeX, relativeY] = relativeCoordinates(x, y, element);
      return {
        aoiType: element.id,
        aoiInfo: "",
        rX: relativeX,
        rY: relativeY
      }
    } else if (element.className === 'react-pdf__Page') {
      const [relativeX, relativeY] = relativeCoordinates(x, y, element);
      return {
        aoiType: 'PDFPage',
        aoiInfo: element.getAttribute('data-page-number')?.toString() || "",
        rX: relativeX,
        rY: relativeY
      }
    }
  }

  return null;
}