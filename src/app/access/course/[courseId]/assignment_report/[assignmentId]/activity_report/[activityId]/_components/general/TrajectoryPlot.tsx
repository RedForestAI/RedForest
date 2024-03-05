import styled from "styled-components";
import { format } from "date-fns";
import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
  Tooltip,
  XYChart
} from "@visx/xychart";
import { useEffect, useState } from "react";
import { ActivityData } from "@prisma/client";
import { AnswerTrace } from "../types";

const line: Line = {
  color: "#008561",
  data: {
    x: ['2018-03-01', '2018-04-01', '2018-05-01'],
    y: [30, 16, 17]
  }
}

const line2: Line = {
  color: "#080561",
  data: {
    x: ['2018-03-01', '2018-04-01', '2018-05-01'],
    y: [60, 66, 67]
  }
}

const tickLabelOffset = 10;

const accessors = {
  xAccessor: (d: any) => d.x,
  yAccessor: (d: any) => d.y
};

const ChartContainer = styled.div`
  text {
    font-family: "Untitled Sans", sans-serif;
  }

  .visx-axis-tick {
    text {
      font-size: 12px;
      font-weight: 400;
      fill: #666666;
    }
  }
`;

const ColoredSquare = styled.div`
  display: inline-block;
  width: 11px;
  height: 11px;
  margin-right: 8px;
  background: ${({ color }) => color};
  border-radius: 4px;
`;

const TooltipContainer = styled.div`
  padding: 8px 16px;
  font-size: 12px;
  border-radius: 4px;
  color: #222222;

  .date {
    font-size: 12px;
    margin-bottom: 8px;
    color: #222222;
    font-weight: 600;
  }
  .value {
    display: flex;
    align-items: center;
    font-weight: 400;
    color: #000000;
  }
`;

export type Line = {
  color: string;
  data: {
    x: any[],
    y: any[]
  };
}

type TrajectoryPlotProps = {
  perStudentDatas: {[key: string]: any}
  activityDatas: ActivityData[]
};
  
function formatData(data: {x: any[], y: any[]}) {
  return data.x.map((x, i) => ({ x, y: data.y[i] }));
}

export default function TrajectoryPlot(props: TrajectoryPlotProps) {
  const [lines, setLines] = useState<Line[]>([line, line2]);

  useEffect(() => {

    // Create lines
    const newLines: Line[] = [];
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
      const line: Line = {
        color: "#008561",
        data: {
          x: x,
          y: y
        }
      }
      newLines.push(line)
    })

    setLines(newLines);

  }, [props.perStudentDatas])
 
  return (
    <ChartContainer>
      <XYChart
        width={600}
        height={270}
        margin={{ left: 60, top: 35, bottom: 38, right: 27 }}
        xScale={{ type: "linear" }}
        yScale={{ type: "linear" }}
      >
        <AnimatedGrid
          columns={false}
          numTicks={4}
          lineStyle={{
            stroke: "#c9c9c9",
            strokeLinecap: "round",
            strokeWidth: 2
          }}
          strokeDasharray="0, 4"
        />
        <AnimatedAxis
          // hideAxisLine
          // hideTicks
          orientation="bottom"
          tickLabelProps={() => ({ dy: tickLabelOffset })}
          left={30}
          numTicks={4}
        />
        <AnimatedAxis
          // hideAxisLine
          // hideTicks
          label={'Accumulative Score'}
          orientation="left"
          numTicks={4}
          tickLabelProps={() => ({ dx: -10, textAnchor: "end" })}
        />

        {lines.map((line, i) => {
          return (
            <AnimatedLineSeries
              key={i}
              stroke={line.color}
              dataKey={i.toString()}
              data={formatData(line.data)}
              {...accessors}
            />
          );
        })}

        <Tooltip
          snapTooltipToDatumX
          snapTooltipToDatumY
          showSeriesGlyphs
          glyphStyle={{
            fill: "#008561",
            strokeWidth: 0
          }}
          renderTooltip={({ tooltipData }) => {
            return (
              <TooltipContainer>
                {Object.entries(tooltipData?.datumByKey!).map((lineDataArray) => {
                  const [key, value] = lineDataArray;

                  return (
                    <div className="row" key={key}>
                      <div className="date">
                        {format(accessors.xAccessor(value.datum), "MMM d")}
                      </div>
                      <div className="value">
                        <ColoredSquare color="#008561" />
                        {accessors.yAccessor(value.datum)}
                      </div>
                    </div>
                  );
                })}
              </TooltipContainer>
            );
          }}
        />
      </XYChart>
    </ChartContainer>
  );
};