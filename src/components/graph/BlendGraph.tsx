import React from 'react';
import BlendGraphTooltip from './tooltips/BlendGraphTooltip';
import { differenceInDays, parseISO } from 'date-fns/esm';
import styled from 'styled-components';
import { getEvenlySpacedDates } from '../../util/Dates';
import { Text } from '../common/Typography';
import Graph, { getIdealDateFormat, getIdealStep } from './Graph';

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

function BlendGraphLegend() {
  return (
    <LegendWrapper>
      <LegendItem>
        <LegendItemBox color={TOTAL_RETURNS_STROKE_COLOR} />
        <Text size='M' weight='medium' color={TEXT_COLOR}>Pool Returns</Text>
      </LegendItem>
      <LegendItem>
        <LegendItemBox color={UNISWAP_V2_STROKE_COLOR} />
        <Text size='M' weight='medium' color={TEXT_COLOR}>Uniswap V2</Text>
      </LegendItem>
      <LegendItem>
        <LegendItemBox color={HODL_STROKE_COLOR} />
        <Text size='M' weight='medium' color={TEXT_COLOR}>50/50 HODL</Text>
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
  const diffInDays = differenceInDays(toDate, fromDate);
  const step = getIdealStep(diffInDays, numberOfUniqueYears);
  const dateFormat = getIdealDateFormat(diffInDays);
  const ticks = getEvenlySpacedDates(dates, step).slice(1);
  return (
    <ResponsiveContainerStyled>
      <Graph
        data={data}
        containerHeight={330}
        dateFormat={dateFormat}
        linearGradients={[
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
        ]}
        ticks={ticks}
        tickTextColor={TEXT_COLOR}
        CustomTooltip={<BlendGraphTooltip />}
        charts={[
          {
            type: 'monotone',
            dataKey: 'Total Returns',
            stroke: TOTAL_RETURNS_STROKE_COLOR,
            fill: 'url(#totalReturnsGradient)',
            fillOpacity: 1,
          },
          {
            type: 'monotone',
            dataKey: 'Uniswap V2',
            stroke: UNISWAP_V2_STROKE_COLOR,
            fillOpacity: 0,
            strokeDasharray: '5 5',
          },
          {
            type: 'monotone',
            dataKey: '50/50 HODL',
            stroke: HODL_STROKE_COLOR,
            fillOpacity: 0,
            strokeDasharray: '5 5',
          }
        ]}
        showLegend={true}
        LegendContent={<BlendGraphLegend />}
      />
      {/* <ResponsiveContainer>
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
            tick={{ fill: TEXT_COLOR, fontSize: '14px' }}
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
      </ResponsiveContainer> */}
    </ResponsiveContainerStyled>
  );
}
