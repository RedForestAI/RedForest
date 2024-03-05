import { useEffect, useState } from "react";
import { ActivityData } from "@prisma/client";
import { AnswerTrace } from "../types";
import { LineChart, Label, Line, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


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
};
  
function formatData(data: {x: any[], y: any[]}) {
  return data.x.map((x, i) => ({ x, y: data.y[i] }));
}

function xTickFormatter(value: number) {
  return value.toFixed(2);
}

export default function TrajectoryPlot(props: TrajectoryPlotProps) {
  const [dataLine, setDataLine] = useState<DataLine[]>([]);

  useEffect(() => {

    // Create lines
    const newLines: DataLine[] = [];
    props.activityDatas.forEach((activityData) => {
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

  }, [props.perStudentDatas])
 
  return (
    <ResponsiveContainer width="100%" height="100%">
        <LineChart
          title="Student Trajectories"
          width={500}
          height={300}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey='x' allowDecimals={false} scale='linear' tickFormatter={xTickFormatter}>
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
          {/* <Legend /> */}
          {dataLine.map((line, i) => (
            <Line key={i} type="linear" dataKey="y" stroke={line.color} activeDot={{ r: 8 }} data={formatData(line.data)} />
          ))}
        </LineChart>
      </ResponsiveContainer>
  );
};