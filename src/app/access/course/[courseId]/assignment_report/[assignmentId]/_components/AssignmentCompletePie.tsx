"use client";

import React, { useState, useEffect } from "react";
import { Group } from "@visx/group";
import Pie, { PieArcDatum } from "@visx/shape/lib/shapes/Pie";
import { scaleOrdinal } from "@visx/scale";

interface Datum {
  label: string;
  value: number;
}

type AssignmentCompletePieProps = {
  data: Datum[];
}

const RATIO = 0.4;

export default function AssignmentCompletePie(props: AssignmentCompletePieProps) {

  const getDataColor = scaleOrdinal({
    domain: props.data.map((l) => l.label),
    range: ["#22c55e", "#facc15", "#ef4444"],
  });

  // Accessor
  const valueAccessor = (d: Datum) => d.value;

  const [width, setWidth] = useState<number>(window.innerWidth * RATIO);
  const [height, setHeight] = useState<number>(window.innerHeight * RATIO);

  // Update dimensions on resize
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth * RATIO);
      setHeight(window.innerHeight * RATIO);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate radius based on the smaller side of the window
  const radius = Math.min(width, height) / 3;
  const centerX = width / 2;
  const centerY = height / 2;

  return (
    <svg width={width} height={height}>
      <Group top={centerY} left={centerX}>
        <Pie<Datum>
          data={props.data}
          pieValue={valueAccessor}
          outerRadius={radius}
          innerRadius={radius / 3}
          padAngle={0.01}
        >
          {(pie) => {
            return pie.arcs.map((arc: PieArcDatum<Datum>, index: number) => (
              <g key={`arc-${arc.data.label}-${index}`}>
                <path
                  d={pie.path(arc) || ""}
                  fill={getDataColor(arc.data.label)}
                ></path>
                <text
                  fill="black"
                  x={pie.path.centroid(arc)[0]}
                  y={pie.path.centroid(arc)[1]}
                  dy=".33em"
                  fontSize={15}
                  textAnchor="middle"
                >
                  {/* Value on one line */}
                  <tspan x={pie.path.centroid(arc)[0]} dy="-0.6em">{arc.data.value}%</tspan>
                  {/* Label on the next line */}
                  <tspan x={pie.path.centroid(arc)[0]} dy="1.2em">{arc.data.label}</tspan>
                </text>
              </g>
            ));
          }}
        </Pie>
      </Group>
    </svg>
  );
};