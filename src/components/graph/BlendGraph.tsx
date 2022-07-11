import React from 'react';
import BlendGraphTooltip from './tooltips/BlendGraphTooltip';
import styled from 'styled-components';
import { Text } from '../common/Typography';
import Graph from './Graph';
import { RESPONSIVE_BREAKPOINT_SM, RESPONSIVE_BREAKPOINT_XS } from '../../data/constants/Breakpoints';

const TEXT_COLOR = '#82a0b6';
// const GREEN_GRADIENT_COLOR = '#59d67c';
const GREEN_STROKE_COLOR = '#00C143';
const PURPLE_STROKE_COLOR = '#865EF2';
const GRAY_STROKE_COLOR = '#C2D1DD';
const GRAY_GRADIENT_COLOR = '#A7BDCE';

const ResponsiveContainerStyled = styled.div`
  position: relative;
  left: -32px;
  width: calc(100% + 64px);
  height: 300px;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    left: -16px;
    width: calc(100% + 32px);
  }

  @media (max-width: ${RESPONSIVE_BREAKPOINT_XS}) {
    left: 0;
    /* 31px in order to avoid overflow in case of decimals */
    // NOTE: this value is 100% plus 2 * the padding of the pool page minus 1 to fill the entire space
    width: calc(100% + 31px);
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
  text-align: center;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    flex-direction: column;
  }
`;

const LegendItemBox = styled.div`
  width: 16px;
  height: 8px;
  background-color: ${(props) => props.color};
  border-radius: 8px;
`;

const LegendItemBoxDashed = styled.div`
  width: 16px;
  height: 1px;
  margin-top: 3.5px;
  margin-bottom: 3.5px;
  background-color: clear;
  border-bottom: 3px dotted;
  border-color: ${(props) => props.color};
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
        <Text size='M' weight='medium' color={TEXT_COLOR}>Blend Pool</Text>
      </LegendItem>
      <LegendItem>
        <LegendItemBoxDashed color={GRAY_STROKE_COLOR} />
        <Text size='M' weight='medium' color={TEXT_COLOR}>Uniswap Baseline</Text>
      </LegendItem>
      <LegendItem>
        <LegendItemBoxDashed color={GREEN_STROKE_COLOR} />
        <Text size='M' weight='medium' color={TEXT_COLOR}>{token0Label}</Text>
      </LegendItem>
      <LegendItem>
        <LegendItemBoxDashed color={PURPLE_STROKE_COLOR} />
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
  const { data, token0Key, token1Key } = props;
  return (
    <ResponsiveContainerStyled>
      <Graph
        data={data}
        containerHeight={330}
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
        tickTextColor={TEXT_COLOR}
        CustomTooltip={<BlendGraphTooltip />}
        charts={[
          {
            type: 'monotone',
            dataKey: 'Blend Pool',
            stroke: GRAY_STROKE_COLOR,
            fill: 'url(#totalReturnsGradient)',
            fillOpacity: 1,
          },
          {
            type: 'monotone',
            dataKey: 'Uniswap Baseline',
            stroke: GRAY_STROKE_COLOR,
            fillOpacity: 0,
            strokeDasharray: '2 2',
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
