import { useEffect, useState, useRef } from "react";
import { ActivityData } from "@prisma/client";
import { AnswerTrace, colorMap } from "../types";
import { LineChart, Label, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';


type DataLine = {
  data: {
    x: any[],
    y: any[]
  };
  id: string;
  color: string;
}

type TrajectoryPlotProps = {
  perStudentDatas: {[key: string]: any}
  activityDatas: ActivityData[]
  selectedId: string[]
  colors: colorMap
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
        totalTime += parseFloat((answerTrace.elapsedTime/1000).toFixed(2));
        x.push(parseFloat((totalTime - 0.01).toFixed(2)))
        y.push(priorScore)
        x.push(totalTime);
        y.push(answerTrace.accumulativeScore)
        priorScore = answerTrace.accumulativeScore;
      }
      const line: DataLine = {
        color: props.colors[activityData.profileId] || 'black',
        id: activityData.profileId,
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
        <text x={dimensions.width / 2} y={10} textAnchor="middle" dominantBaseline="central">
          <tspan fontSize="20" fill="#6F6F6E">Student Trajectories</tspan>
        </text>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey='x' allowDecimals={false} allowDuplicatedCategory={false} type="number" domain={[0, (dataMax: number) => (dataMax*1.05)]} scale='linear' tickFormatter={xTickFormatter}>
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
          <Line id={line.id} key={line.id} type="linear" dataKey="y" stroke={line.color} strokeWidth={4} activeDot={{ r: 8 }} data={formatData(line.data)} />
        ))}
      </LineChart>
    </div>
  );
};