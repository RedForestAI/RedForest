import React from 'react';
import { Group } from '@visx/group';
import { Pie } from '@visx/shape';
import { scaleOrdinal } from 'd3-scale';
import { schemeCategory10 } from 'd3-scale-chromatic';

// Dummy data
const data = [
  { label: 'A', value: 10 },
  { label: 'B', value: 30 },
  { label: 'C', value: 20 },
  { label: 'D', value: 40 }
];

// Accessor
const valueAccessor = d => d.value;

// Create color scale
const colorScale = scaleOrdinal({
  domain: data.map(d => d.label),
  range: schemeCategory10,
});

function PieChart() {
  return (
    <svg width={400} height={400}>
      <Group top={200} left={200}>
        <Pie
          data={data}
          pieValue={valueAccessor}
          outerRadius={150}
          innerRadius={50}
          padAngle={0.01}
        >
          {pie => {
            return pie.arcs.map((arc, index) => (
              <g key={`arc-${arc.data.label}-${index}`}>
                <path d={pie.path(arc)} fill={colorScale(arc.data.label)}></path>
                <text
                  fill="white"
                  x={pie.path.centroid(arc)[0]}
                  y={pie.path.centroid(arc)[1]}
                  dy=".33em"
                  fontSize={15}
                  textAnchor="middle"
                >
                  {arc.data.label}
                </text>
              </g>
            ));
          }}
        </Pie>
      </Group>
    </svg>
  );
}

export default PieChart;
