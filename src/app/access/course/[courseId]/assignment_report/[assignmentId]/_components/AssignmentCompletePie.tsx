"use client";

import React, { useState, useEffect } from "react";
import { LabelList, Cell, PieChart, Pie, Legend, Tooltip, ResponsiveContainer } from 'recharts';


interface Datum {
  label: string;
  value: number;
}

type AssignmentCompletePieProps = {
  data: Datum[];
}

const data01 = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
  { name: 'Group E', value: 278 },
  { name: 'Group F', value: 189 },
];

const data02 = [
  { name: 'Group A', value: 2400 },
  { name: 'Group B', value: 4567 },
  { name: 'Group C', value: 1398 },
  { name: 'Group D', value: 9800 },
  { name: 'Group E', value: 3908 },
  { name: 'Group F', value: 4800 },
];

const RATIO = 0.4;
const COLORS = ["#22c55e", "#facc15", "#ef4444"];

export default function AssignmentCompletePie(props: AssignmentCompletePieProps) {

  const validData = props.data.filter((d) => d.value > 0);
  // const colors = validData.map((d, i) => COLORS[d.index % COLORS.length]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={600} height={600}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={validData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          label
        > 
          {
            validData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))
          }
          {
            validData.map((entry, index) => (
              <LabelList key={`label-${index}`} dataKey="label" position="inside" fill="#fff" />
            ))
          }
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};