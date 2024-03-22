import ReactDOM from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import { IDocument } from '@cyntler/react-doc-viewer'
import * as d3 from 'd3'

type HeatmapOverlayProps = {
  page?: Element;
  activeDocument?: IDocument;
  docs: { uri: string }[];
  perStudentDatas: {[key: string]: any};
  selectedId: string[];
}

type DataPoint = {
  x: number;
  y: number;
}

const OPACITY = 0.1;
const RATIO = 0.05

export default function HeatmapOverlay(props: HeatmapOverlayProps) {
  if (!props.page) return null

  const svgRef = useRef(null);
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    if (!props.perStudentDatas) return
    if (!props.page) return
    if (!props.activeDocument) return
    
    // Assuming data is an array of { x, y, value } points
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    // Get the height and width of the page
    const index = props.docs.findIndex((doc) => doc.uri === props.activeDocument?.uri);
    const pageNumber = props.page.getAttribute("data-page-number");
    const height = props.page.clientHeight;
    const width = props.page.clientWidth;
    
    // Iterate over the gaze in the perStudentDatas and add them to the data array
    const newData: DataPoint[] = []; 
    for (const [id, studentId] of Object.entries(props.selectedId)) {

      if (!props.perStudentDatas[studentId]) continue;

      // Get the data
      const perStudentData = props.perStudentDatas[studentId];

      // Skip if the student hasn't completed the activity
      if (!perStudentData.complete) continue;

      const gaze = perStudentData.logs.gaze
      const currentPdfTimes = perStudentData.dataStore.pdfTimes[index];

      if (!gaze || !currentPdfTimes) continue;
      
      for (let i = 1; i < gaze.length; i++) {
        const point = gaze[i];
       
        // Check if the point is in the current pdf
        const timestamp = new Date(point[0]);
        let inPdf = false; 
        for (let j = 0; j < currentPdfTimes.length; j++) {
          const pdfTime = currentPdfTimes[j];
          if (timestamp >= pdfTime.start && timestamp <= pdfTime.end) {
            inPdf = true;
            break;
          }
        }
        if (!inPdf) continue;

        // Check if the point is in the current page
        if ((point[3] == 'PDFPage') && (point[4] == pageNumber)) {
          newData.push({
            x: point[5] * width,
            y: point[6] * height,
          });
        }
      }
    }
    setData(newData);

  }, [props.perStudentDatas, props.page, props.activeDocument, props.selectedId]);

  useEffect(() => {
    if (!props.page || (data.length == 0)) return
    // Get the height and width of the page
    const height = props.page.clientHeight;
    const width = props.page.clientWidth;

    // Assuming data is an array of { x, y, value } points
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    // Setup your heatmap here using d3.js
    // For example, defining a color scale based on your data's value range
    // const colorScale = d3.scaleSequential(d3.interpolateInferno)
    //   .domain(d3.extent(data, (d: any) => d.value));

    // Compute the density data
    const densityData = d3.contourDensity()
      .x((d: any) => d.x)
      .y((d: any) => d.y)
      .size([width,height]) // Width x Height
      .bandwidth(width*RATIO) // Adjust as needed
      // @ts-ignore
      (data);

    // Determine max value
    const maxValue = d3.max(densityData, (d: any) => d.value);
    
    // Create a color scale
    const color = d3.scaleLinear()
      .domain([0,maxValue])
      // @ts-ignore
      .range([`rgba(0,0,255,${OPACITY})`, `rgba(255,0,0,${OPACITY})`])

    // Show the shape
    svg.insert("g", "g")
      .selectAll('path')
      .data(densityData)
      .enter().append('path')
        .attr('d', d3.geoPath())
        .attr('fill', (d: any) => color(d.value))

  }, [data]);

  return ReactDOM.createPortal(
    <div
      id={`heatmapOverlay`}
      className="absolute left-0 top-0 h-full w-full z-50"
    >
      <svg ref={svgRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: "100%", height: "100%" }}></svg>
    </div>,
    props.page,
  )
}