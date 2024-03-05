"use client";

import React, { useState, useEffect } from "react";
import { Label, Cell, PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';


export interface Datum {
  index: number;
  label: string;
  value: number;
}

type AssignmentCompletePieProps = {
  data: Datum[];
}

const RADIAN = Math.PI / 180; 
const COLORS = ["#22c55e", "#facc15", "#ef4444"];

export default function AssignmentCompletePie(props: AssignmentCompletePieProps) {

  const validData = props.data.filter((d) => d.value > 0);
  const colors = validData.map((d, i) => COLORS[i % COLORS.length]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={600} height={600}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={validData}
          cx="50%"
          cy="50%"
          outerRadius={140}
          fill="#8884d8"
          labelLine={false}
          label={({
          cx,
          cy,
          midAngle,
          innerRadius,
          outerRadius,
          value,
          index
        }) => {
          const RADIAN = Math.PI / 180;
          const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
          const x = cx + radius * Math.cos(-midAngle * RADIAN);
          const y = cy + radius * Math.sin(-midAngle * RADIAN);

          return (
            <text
              x={x}
              y={y}
              fill="white"
              textAnchor={"middle"}
              dominantBaseline="central"
            >
              {props.data[index]!.label} ({value})
            </text>
          );
        }}
        > 
          {
            validData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))
          }
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};