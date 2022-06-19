import React from 'react';
import BlendGraphTooltip from './tooltips/BlendGraphTooltip';
import { differenceInDays, parseISO } from 'date-fns/esm';
import styled from 'styled-components';
import { getEvenlySpacedDates } from '../../util/Dates';
import { Text } from '../common/Typography';
import Graph, { getIdealDateFormat, getIdealStep } from './Graph';

const TEXT_COLOR = '#82a0b6';
const GREEN_GRADIENT_COLOR = '#59d67c';
const GREEN_STROKE_COLOR = '#00C143';
const PURPLE_STROKE_COLOR = '#865EF2';
const GRAY_STROKE_COLOR = '#C2D1DD';
const GRAY_GRADIENT_COLOR = '#A7BDCE';

const ResponsiveContainerStyled = styled.div`
  position: relative;
  left: -32px;
  width: calc(100% + 64px);
  height: 300px;

  @media (max-width: 768px) {
    left: -16px;
    width: calc(100% + 32px);
  }
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

type BlendGraphLegendProps = {
  token0Label: string;
  token1Label: string;
};

function BlendGraphLegend(props: BlendGraphLegendProps) {
  const { token0Label, token1Label } = props;
  return (
    <LegendWrapper>
      <LegendItem>
        <LegendItemBox color={GRAY_STROKE_COLOR} />
        <Text size='M' weight='medium' color={TEXT_COLOR}>Pool Returns</Text>
      </LegendItem>
      <LegendItem>
        <LegendItemBox color={GREEN_STROKE_COLOR} />
        <Text size='M' weight='medium' color={TEXT_COLOR}>{token0Label}</Text>
      </LegendItem>
      <LegendItem>
        <LegendItemBox color={PURPLE_STROKE_COLOR} />
        <Text size='M' weight='medium' color={TEXT_COLOR}>{token1Label}</Text>
      </LegendItem>
    </LegendWrapper>
  );
}

export type BlendGraphProps = {
  data: any;
  token0Key: string;
  token1Key: string;
  fromDate: Date;
  toDate: Date;
};

export default function BlendGraph(props: BlendGraphProps) {
  const { data, token0Key, token1Key, fromDate, toDate } = props;
  const dates = data.map((d: any) => d.x) as string[];
  // TODO: move this logic to a util function and use it in both BlendGraph and PortfolioGraph
  const updatedTo = new Date(dates[dates.length - 1]);
  const updatedFrom = new Date(dates[0]);
  const numberOfUniqueYears = new Set(
    dates.map((d) => parseISO(d).getFullYear())
  ).size;
  const diffInDays = differenceInDays(updatedTo, updatedFrom);
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
                stopColor={GRAY_GRADIENT_COLOR}
                stopOpacity={0.25}
              />
              <stop
                offset='75%'
                stopColor={GRAY_GRADIENT_COLOR}
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
            dataKey: 'Pool Returns',
            stroke: GRAY_STROKE_COLOR,
            fill: 'url(#totalReturnsGradient)',
            fillOpacity: 1,
          },
          {
            type: 'monotone',
            dataKey: token0Key,
            stroke: GREEN_STROKE_COLOR,
            fillOpacity: 0,
            strokeDasharray: '2 2',
          },
          {
            type: 'monotone',
            dataKey: token1Key,
            stroke: PURPLE_STROKE_COLOR,
            fillOpacity: 0,
            strokeDasharray: '2 2',
          }
        ]}
        showLegend={true}
        LegendContent={<BlendGraphLegend token0Label={token0Key} token1Label={token1Key} />}
        yAxisDomain={['dataMin', 'dataMax']}
      />
    </ResponsiveContainerStyled>
  );
}
