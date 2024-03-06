import { useEffect, useState, useRef } from "react";
import { ActivityData } from "@prisma/client";
import { AnswerTrace } from "../types";
import { LineChart, Label, Line, Text, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


type DataLine = {
  data: {
    x: any[],
    y: any[]
  }
  color: string;
}

type TrajectoryPlotProps = {
  perStudentDatas: {[key: string]: any}
  activityDatas: ActivityData[]
  selectedId: string[]
};
  
function formatData(data: {x: any[], y: any[]}) {
  return data.x.map((x, i) => ({ x, y: data.y[i] }));
}

function xTickFormatter(value: number) {
  return value.toFixed(2);
}

export default function TrajectoryPlot(props: TrajectoryPlotProps) {
  const [dataLine, setDataLine] = useState<DataLine[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const parentRef = useRef(null);

  useEffect(() => {

    // Create lines
    const newLines: DataLine[] = [];
    props.activityDatas.forEach((activityData) => {

      // Skip if not selected
      if (!props.selectedId.includes(activityData.profileId)) {
        return;
      }

      let totalTime: number = 0;
      let priorScore: number = 0;
      const x: number[] = [0];
      const y: number[] = [0];
      
      for (let i = 0; i < activityData.answersTrace.length; i++) {
        // @ts-ignore
        const answerTrace = activityData.answersTrace[i] as AnswerTrace;
        totalTime += answerTrace.elapsedTime/1000;
        x.push(totalTime - 0.0001)
        y.push(priorScore)
        x.push(totalTime);
        y.push(answerTrace.accumulativeScore)
        priorScore = answerTrace.accumulativeScore;
      }
      const line: DataLine = {
        color: "#008561",
        data: {
          x: x,
          y: y
        }
      }
      newLines.push(line)
    })

    setDataLine(newLines);

  }, [props.perStudentDatas, props.selectedId])

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    if (parentRef.current) {
      resizeObserver.observe(parentRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);
 
  return (
    <div ref={parentRef} style={{ width: '100%', height: '30vh' }}> {/* Adjust the height as necessary */}
      <LineChart
        width={dimensions.width}
        height={dimensions.height}
        margin={{
          top: 40,
          right: 0,
          left: 0,
          bottom: 5,
        }}
      >
        <text x={dimensions.width / 2} y={10} fill="black" textAnchor="middle" dominantBaseline="central">
          <tspan fontSize="20">Student Trajectories</tspan>
        </text>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey='x' allowDecimals={false} allowDuplicatedCategory={false} scale='linear' tickFormatter={xTickFormatter}>
          <Label 
            position='insideBottom'
            dy={8}
          >
            Time (s)
          </Label>
        </XAxis>
        <YAxis allowDecimals={false}>
          <Label 
            position='outside'
            angle={-90}
          >
            Accumulative Score
          </Label>
        </YAxis>
        <Tooltip />
        {dataLine.map((line, i) => (
          <Line key={i} type="linear" dataKey="y" stroke={line.color} activeDot={{ r: 8 }} data={formatData(line.data)} />
        ))}
      </LineChart>
    </div>
  );
};