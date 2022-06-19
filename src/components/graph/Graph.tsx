import React from 'react';
import {
  Area,
  AreaChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format, parseISO } from 'date-fns/esm';
import { CurveType } from 'recharts/types/shape/Curve';
import { AxisDomain } from 'recharts/types/util/types';

export function getIdealStep(diffInDays: number, numUniqueYears: number) : number {
  if (diffInDays <= 7) {
    return 5;
  } else if (diffInDays <= 366) {
    return 4;
  } else {
    return numUniqueYears - 1 - 2; // Subtract 2 because we don't want to show the first and last year
  }
}

export function getIdealDateFormat(diffInDays: number) : string {
  if (diffInDays <= 1) {
    return 'ha';
  } else if (diffInDays <= 7) {
    return 'iii';
  } else if (diffInDays <= 31 * 3) {
    return 'MMM dd';
  } else if (diffInDays <= 366) {
    return 'MMM';
  } else {
    return 'yyyy';
  }
}

export type GraphChart = {
  type: CurveType;
  dataKey: string;
  stroke: string;
  fill?: string;
  fillOpacity: number;
  strokeDasharray?: string;
  activeDot?: JSX.Element;
};

export type CustomizedResponsiveContainerProps = {
  className?: string;
  height?: number;
  children: React.ReactElement;
  setIsActive?: (isActive: boolean) => void;
};

function CustomizedResponsiveContainer(
  props: CustomizedResponsiveContainerProps
) {
  const { className, height, children, setIsActive } = props;
  return (
    <div
      onMouseEnter={() => {
        if (setIsActive) {
          setIsActive(true);
        }
      }}
      onMouseLeave={() => {
        if (setIsActive) {
          setIsActive(false);
        }
      }}
    >
      <ResponsiveContainer className={className} height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export type GraphProps = {
  data: any;
  containerHeight: number;
  containerClassName?: string;
  charts: GraphChart[];
  dateFormat: string;
  ticks: string[];
  tickTextColor: string;
  linearGradients?: React.SVGProps<SVGLinearGradientElement>[];
  CustomTooltip?: JSX.Element;
  tooltipPosition?: { x: number | undefined; y: number | undefined };
  tooltipOffset?: number;
  tooltipCursor?: React.SVGProps<SVGElement>;
  showLegend?: boolean;
  LegendContent?: JSX.Element;
  allowEscapeViewBoxX?: boolean;
  yAxisDomain?: AxisDomain;
  setIsActive?: (isActive: boolean) => void;
};

export default function Graph(props: GraphProps) {
  const {
    data,
    containerHeight,
    containerClassName,
    charts,
    dateFormat,
    ticks,
    tickTextColor,
    linearGradients,
    CustomTooltip,
    tooltipPosition,
    tooltipOffset,
    tooltipCursor,
    showLegend,
    LegendContent,
    allowEscapeViewBoxX,
    yAxisDomain,
    setIsActive,
  } = props;

  return (
    <CustomizedResponsiveContainer
      className={containerClassName}
      height={containerHeight}
      setIsActive={setIsActive}
    >
      <AreaChart
        width={964}
        data={data}
        margin={{ top: 0, left: 0, bottom: 0, right: 0 }}
        // @ts-ignore
        baseValue={'dataMin'}
      >
        <defs>
          {linearGradients &&
            linearGradients.map((gradient, index) => (
              <React.Fragment key={index}>{gradient}</React.Fragment>
            ))}
        </defs>
        <XAxis
          dataKey='x'
          axisLine={false}
          domain={['auto', 'auto']}
          interval={0}
          ticks={ticks}
          tick={{ fill: tickTextColor, fontSize: '14px' }}
          tickFormatter={(tickString) =>
            format(parseISO(tickString), dateFormat)
          }
          tickLine={false}
        />
        <YAxis
          axisLine={false}
          tick={false}
          width={0}
          domain={yAxisDomain}
        />
        <Tooltip
          content={CustomTooltip}
          allowEscapeViewBox={{ x: allowEscapeViewBoxX, y: false }}
          isAnimationActive={false}
          position={tooltipPosition}
          offset={tooltipOffset}
          cursor={tooltipCursor}
        />
        {charts.map((chart, index) => (
          <Area
            key={index}
            type={chart.type}
            dataKey={chart.dataKey}
            stroke={chart.stroke}
            fill={chart.fill}
            fillOpacity={chart.fillOpacity}
            strokeDasharray={chart.strokeDasharray}
            isAnimationActive={false}
            activeDot={chart.activeDot}
          />
        ))}
        {showLegend && (
          <Legend iconType='rect' content={LegendContent}></Legend>
        )}
      </AreaChart>
    </CustomizedResponsiveContainer>
  );
}
