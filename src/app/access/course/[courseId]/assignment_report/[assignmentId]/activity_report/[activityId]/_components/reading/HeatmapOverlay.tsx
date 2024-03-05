import ReactDOM from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { set } from 'zod';

type HeatmapOverlayProps = {
  page?: Element;
}

type DataPoint = {
  x: number;
  y: number;
}

const OPACITY = 0.1;
const RATIO = 0.05

function generateMockData(numberOfPoints = 10, width = 600, height = 400): DataPoint[] {
  const data = Array.from({ length: numberOfPoints }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
  }));

  return data;
}

export default function HeatmapOverlay(props: HeatmapOverlayProps) {
  if (!props.page) return null

  const svgRef = useRef(null);
  const [data, setData] = useState<DataPoint[]>([]);

  useEffect(() => {
    if (!props.page) return
    // Get the height and width of the page
    const height = props.page.clientHeight;
    const width = props.page.clientWidth;
    const newData = generateMockData(100, width, height);
    setData(newData);
  }, [props.page]);

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