import React from 'react';
import {
  Area,
  AreaChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import BlendGraphTooltip from './BlendGraphTooltip';
import { differenceInDays, format, parseISO } from 'date-fns/esm';
import styled from 'styled-components';
import tw from 'twin.macro';
import { getEvenlySpacedDates } from '../../util/Dates';

const TEXT_COLOR = '#82a0b6';
const TOTAL_RETURNS_GRADIENT_COLOR = '#59d67c';
const TOTAL_RETURNS_STROKE_COLOR = '#00C143';
const UNISWAP_V2_STROKE_COLOR = '#865EF2';
const HODL_STROKE_COLOR = '#C2D1DD';

const ResponsiveContainerStyled = styled.div`
  position: relative;
  left: -32px;
  width: calc(100% + 64px);
  height: 300px;
`;

const LegendWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 32px;
  margin-top: 8px;
  margin-bottom: 24px;
`;

const LegendItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const LegendItemBox = styled.div`
  width: 16px;
  height: 8px;
  background-color: ${(props) => props.color};
  border-radius: 8px;
`;

const LegendItemText = styled.div`
  ${tw`text-sm`}
  color: ${TEXT_COLOR};
`;

function BlendGraphLegend() {
  return (
    <LegendWrapper>
      <LegendItem>
        <LegendItemBox color={TOTAL_RETURNS_STROKE_COLOR} />
        <LegendItemText>Pool Returns</LegendItemText>
      </LegendItem>
      <LegendItem>
        <LegendItemBox color={UNISWAP_V2_STROKE_COLOR} />
        <LegendItemText>Uniswap V2</LegendItemText>
      </LegendItem>
      <LegendItem>
        <LegendItemBox color={HODL_STROKE_COLOR} />
        <LegendItemText>50/50 HODL</LegendItemText>
      </LegendItem>
    </LegendWrapper>
  );
}

export type BlendGraphProps = {
  data: any;
  fromDate: Date;
  toDate: Date;
};

export default function BlendGraph(props: BlendGraphProps) {
  const { data, fromDate, toDate } = props;
  const dates = data.map((d: any) => d.x) as string[];
  const numberOfUniqueYears = new Set(
    dates.map((d) => parseISO(d).getFullYear())
  ).size;
  let step = 3;
  let dateFormat = 'MMM yyyy';
  if (differenceInDays(toDate, fromDate) <= 1) {
    step = 5;
    dateFormat = 'ha';
  } else if (differenceInDays(toDate, fromDate) <= 7) {
    step = 5;
    dateFormat = 'iii';
  } else if (differenceInDays(toDate, fromDate) <= 31 * 3) {
    step = 4;
    dateFormat = 'MMM dd';
  } else if (differenceInDays(toDate, fromDate) <= 366) {
    step = 4;
    dateFormat = 'MMM';
  } else {
    step = numberOfUniqueYears - 1 - 2; // Subtract 2 because we don't want to show the first and last year
    dateFormat = 'yyyy';
  }
  const ticks = getEvenlySpacedDates(dates, step).slice(1);
  return (
    <ResponsiveContainerStyled>
      <ResponsiveContainer>
        <AreaChart
          width={964}
          height={300}
          data={data}
          margin={{ top: 0, left: 0, bottom: 0, right: 0 }}
        >
          <defs>
            <linearGradient id='totalReturnsGradient' x1='0' y1='0' x2='0' y2='1'>
              <stop
                offset='-29%'
                stopColor={TOTAL_RETURNS_GRADIENT_COLOR}
                stopOpacity={0.25}
              />
              <stop
                offset='99.93%'
                stopColor={TOTAL_RETURNS_GRADIENT_COLOR}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <XAxis
            dataKey='x'
            axisLine={false}
            domain={['auto', 'auto']}
            interval={0}
            ticks={ticks}
            tick={{ fill: TEXT_COLOR }}
            tickFormatter={(tickString) =>
              format(parseISO(tickString), dateFormat)
            }
            tickLine={false}
          />
          <Tooltip
            content={<BlendGraphTooltip />}
            allowEscapeViewBox={{ x: false, y: false }}
            isAnimationActive={false}
          />
          <Area
            type='monotone'
            dataKey='Total Returns'
            stroke={TOTAL_RETURNS_STROKE_COLOR}
            fillOpacity={1}
            fill='url(#totalReturnsGradient)'
            isAnimationActive={false}
          />
          <Area
            type='monotone'
            dataKey='Uniswap V2'
            stroke={UNISWAP_V2_STROKE_COLOR}
            fillOpacity={0}
            strokeDasharray='5 5'
            isAnimationActive={false}
          />
          <Area
            type='monotone'
            dataKey='50/50 HODL'
            stroke={HODL_STROKE_COLOR}
            fillOpacity={0}
            strokeDasharray='5 5'
            isAnimationActive={false}
          />
          <Legend iconType='rect' content={BlendGraphLegend}></Legend>
        </AreaChart>
      </ResponsiveContainer>
    </ResponsiveContainerStyled>
  );
}
