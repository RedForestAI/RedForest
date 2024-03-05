import ReactDOM from 'react-dom'
import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

type HeatmapOverlayProps = {
  page?: Element;
}

function generateMockData(numberOfPoints = 50, width = 600, height = 400) {
  const data = Array.from({ length: numberOfPoints }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    value: Math.random() * 100,
  }));

  return data;
}

const data = generateMockData();


export default function HeatmapOverlay(props: HeatmapOverlayProps) {
  if (!props.page) return null

  const svgRef = useRef(null);

  useEffect(() => {
    // Assuming data is an array of { x, y, value } points
    const svg = d3.select(svgRef.current);
    
    // Setup your heatmap here using d3.js
    // For example, defining a color scale based on your data's value range
    const colorScale = d3.scaleSequential(d3.interpolateInferno)
      .domain(d3.extent(data, (d: any) => d.value));

    // Append heatmap elements to svg
    // This is a simplified example, actual implementation would depend on your heatmap logic
    svg.selectAll('.heatmap-point')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'heatmap-point')
      .attr('cx', (d: any) => d.x)
      .attr('cy', (d: any) => d.y)
      .attr('r', 5) // Example radius, adjust based on your needs
      .style('fill', (d: any) => colorScale(d.value));

    // Additional d3.js logic to create a smooth heatmap...

  }, [data]);

  return ReactDOM.createPortal(
    <div
      id={`heatmapOverlay`}
      className="absolute left-0 top-0 h-full w-full z-50"
    >
      <svg ref={svgRef} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}></svg>
    </div>,
    props.page,
  )
}