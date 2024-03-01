import styled from "styled-components";
import { format } from "date-fns";
import {
  AnimatedAxis,
  AnimatedGrid,
  AnimatedLineSeries,
  Tooltip,
  XYChart
} from "@visx/xychart";

const data1 = [
  {
    x: "2018-03-01",
    y: 30
  },
  {
    x: "2018-04-01",
    y: 16
  },
  {
    x: "2018-05-01",
    y: 17
  },
  {
    x: "2018-06-01",
    y: 24
  },
  {
    x: "2018-07-01",
    y: 47
  },
  {
    x: "2018-08-01",
    y: 32
  },
  {
    x: "2018-09-01",
    y: 8
  },
  {
    x: "2018-10-01",
    y: 27
  },
  {
    x: "2018-11-01",
    y: 31
  },
  {
    x: "2018-12-01",
    y: 105
  },
  {
    x: "2019-01-01",
    y: 166
  },
  {
    x: "2019-02-01",
    y: 181
  },
  {
    x: "2019-03-01",
    y: 232
  },
  {
    x: "2019-04-01",
    y: 224
  },
  {
    x: "2019-05-01",
    y: 196
  },
  {
    x: "2019-06-01",
    y: 211
  }
];

const tickLabelOffset = 10;

const accessors = {
  xAccessor: (d: any) => new Date(`${d.x}T00:00:00`),
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

export default function TrajectoryPlot() {
  return (
    <ChartContainer>
      <XYChart
        height={270}
        margin={{ left: 60, top: 35, bottom: 38, right: 27 }}
        xScale={{ type: "time" }}
        yScale={{ type: "linear" }}
      >
        <AnimatedGrid
          columns={false}
          numTicks={4}
          lineStyle={{
            stroke: "#e1e1e1",
            strokeLinecap: "round",
            strokeWidth: 1
          }}
          strokeDasharray="0, 4"
        />
        <AnimatedAxis
          hideAxisLine
          hideTicks
          orientation="bottom"
          tickLabelProps={() => ({ dy: tickLabelOffset })}
          left={30}
          numTicks={4}
        />
        <AnimatedAxis
          hideAxisLine
          hideTicks
          orientation="left"
          numTicks={4}
          tickLabelProps={() => ({ dx: -10 })}
        />

        <AnimatedLineSeries
          stroke="#008561"
          dataKey="primary_line"
          data={data1}
          {...accessors}
        />
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
                {Object.entries(tooltipData.datumByKey).map((lineDataArray) => {
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