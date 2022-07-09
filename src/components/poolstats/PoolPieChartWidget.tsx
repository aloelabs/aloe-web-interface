import React, { useContext, useState } from 'react';
import WidgetHeading from '../common/WidgetHeading';
import styled from 'styled-components';
import tw from 'twin.macro';
import { BlendPoolMarkers } from '../../data/BlendPoolMarkers';
import { ResolveBlendPoolDrawData } from '../../data/BlendPoolDataResolver';

import { BlendPoolContext } from '../../data/context/BlendPoolContext';
import Tooltip from '../common/Tooltip';
import { RESPONSIVE_BREAKPOINT_SM } from '../../data/constants/Breakpoints';
import { Text } from '../common/Typography';

export type PoolStatsWidgetProps = {
  poolData: BlendPoolMarkers;
};

// MARK: Capturing Mouse Data on container div ---------------------------------------

const PIE_CHART_HOVER_GROWTH = 1.05;
const TOKEN0_COLOR_UNISWAP = '#BEEDC7';
const TOKEN0_COLOR_SILO = '#59D67C';
const TOKEN0_COLOR_FLOAT = '#00C143';
const TOKEN1_COLOR_UNISWAP = '#BBA3F7';
const TOKEN1_COLOR_SILO = '#865EF2';
const TOKEN1_COLOR_FLOAT = '#6002EE';

const PieChartContainer = styled.div`
  transform: rotate(90deg);
`;

// MARK: Pie chart setup -------------------------------------------------------------

type PieChartSlice = {
  index: number;
  percent: number;
  color: string;
};

type AllocationPieChartSlice = PieChartSlice & {
  category: string;
  metric?: string;
};

type PieChartSlicePath = {
  data: string;
  color: string;
  percent: number;
};

function getCoordinatesForPercent(percent: number) {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x, y];
}

const TokenAllocationWrapper = styled.div`
  ${tw`w-full h-full mt-4 pt-2 flex flex-nowrap`}
  flex-direction: row;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    flex-direction: column;
  }
`;

const ExpandingPath = styled.path`
  transition: all 0.15s ease-in;

  :hover {
    transform: scale(${PIE_CHART_HOVER_GROWTH});
  }
`;

const PieChartLabel = styled.div`
  --width: 145.28px;
  --height: 145.28px;

  position: absolute;
  width: var(--width);
  height: var(--height);

  // set top left corner to be centered in parent
  left: 50%;
  top: 50%;
  // offset top left corner by element width so that text is centered
  margin-left: calc(var(--width) / -2);
  margin-top: calc(var(--height) / -2);

  // padding and alignment
  padding: 4px 15px;
  display: flex;
  justify-content: center;
  align-items: center;

  // stuff to make animation work
  pointer-events: none;
  transition: all 0.1s linear;

  // colors, borders, text
  border-radius: calc(var(--height) / 2);
  background-color: rgba(7, 14, 18, 1);
  color: rgba(255, 255, 255, 1);
  ${tw`font-bold`};
`;

const TokenAllocationBreakdown = styled.div`
  ${tw`flex flex-col justify-center gap-y-12`};
  margin-left: 45px;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    margin-left: 0;
    margin-top: 32px;
  }
`;

const LabelWrapper = styled.div`
  ${tw`flex flex-col justify-center items-center`};
  & div {
    transition: color 0.15s linear;
  }
`;

const TokenLabel = styled.div`
  width: 80px;
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  color: rgba(255, 255, 255, 1);
  transition: color 0.15s linear;

  &.inactive {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const AllocationSection = styled.div<{ color: string }>`
  ${tw`w-full flex`};
  position: relative;
  white-space: nowrap;
  padding-left: 24px;

  /* The colored circles to the left of the label */
  :before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0px;

    width: 8px;
    height: 8px;
    aspect-ratio: 1;
    margin-top: -4px;

    border-radius: 50%;
    background: ${({ color }) => color};
    z-index: 5;
  }

  /* The bar that connects the top circle to a middle circle (doesn't need to extend upwards) */
  :first-child:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 3.5px;
    width: 2px;
    height: 50%;
    background: rgba(255, 255, 255, 0.4);
    z-index: 2;
  }

  /* The bar that connects a middle circle to the surrounding circles */
  :not(:first-child):not(:last-child):after {
    content: '';
    position: absolute;
    top: 0%;
    left: 3.5px;
    width: 2px;
    height: 100%;
    background: rgba(255, 255, 255, 0.4);
    z-index: 2;
  }

  /* The bar that connects the bottom circle to a middle circle (doesn't need to extend downwards) */
  :last-child:after {
    content: '';
    position: absolute;
    top: 0%;
    left: 3.5px;
    width: 2px;
    height: 50%;
    background: rgba(255, 255, 255, 0.4);
    z-index: 2;
  }
`;

const DashedDivider = styled.div`
  margin-left: 8px;
  margin-right: 8px;
  position: relative;
  flex-grow: 1;
  /* The dashed line */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: calc(50% - 1px);
    width: 100%;
    height: 1px;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.4);
  }
`;

export default function PoolPieChartWidget(props: PoolStatsWidgetProps) {
  const drawData = ResolveBlendPoolDrawData(props.poolData);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [currentPercent, setCurrentPercent] = useState('');

  const onMouseEnter = (index: number, percent: string) => {
    setActiveIndex(index);
    setCurrentPercent(`${(parseFloat(percent) * 100).toFixed(2)}%`);
  };

  const onMouseLeave = () => {
    setActiveIndex(-1);
    setCurrentPercent('');
  };

  const { poolStats } = useContext(BlendPoolContext);

  const slices: AllocationPieChartSlice[] = [];
  if (drawData && poolStats) {
    const silo0_1 = poolStats.inventory0.silo.mul(poolStats.token1OverToken0);
    const float0_1 = poolStats.inventory0.float.mul(poolStats.token1OverToken0);
    const uni0_1 = poolStats.inventory0.uniswap.mul(poolStats.token1OverToken0);
    const uni1 = poolStats.inventory1.uniswap;
    const float1 = poolStats.inventory1.float;
    const silo1 = poolStats.inventory1.silo;

    if (poolStats.tvl_1.gt(0)) {
      slices[0] = {
        index: 0,
        percent: float0_1.div(poolStats.tvl_1).toNumber(),
        color: TOKEN0_COLOR_FLOAT,
        category: 'Float',
      };
      slices[1] = {
        index: 1,
        percent: silo0_1.div(poolStats.tvl_1).toNumber(),
        color: TOKEN0_COLOR_SILO,
        category: drawData.silo0Label,
        // metric: '2% APY',
      };
      slices[2] = {
        index: 2,
        percent: uni0_1.div(poolStats.tvl_1).toNumber(),
        color: TOKEN0_COLOR_UNISWAP,
        category: 'Uniswap',
        // metric: '1% APR',
      };
      slices[3] = {
        index: 3,
        percent: uni1.div(poolStats.tvl_1).toNumber(),
        color: TOKEN1_COLOR_UNISWAP,
        category: 'Uniswap',
        // metric: '1% APR',
      };
      slices[4] = {
        index: 4,
        percent: silo1.div(poolStats.tvl_1).toNumber(),
        color: TOKEN1_COLOR_SILO,
        category: drawData.silo1Label,
        // metric: '2% APY',
      };
      slices[5] = {
        index: 5,
        percent: float1.div(poolStats.tvl_1).toNumber(),
        color: TOKEN1_COLOR_FLOAT,
        category: 'Float',
      };
    }
  }

  let cumulativePercent = 0;
  const paths: PieChartSlicePath[] = slices.map((slice) => {
    // destructuring assignment sets the two variables at once
    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
    // each slice starts where the last slice ended, so keep a cumulative percent
    cumulativePercent += slice.percent;
    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
    // if the slice is more than 50%, take the large arc (the long way around)
    const largeArcFlag = slice.percent > 0.5 ? 1 : 0;

    // create an array and join it just for code readability
    const pathData = [
      `M ${startX} ${startY}`, // Move
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
      `L 0 0`, // Line
    ].join(' ');
    return {
      data: pathData,
      color: slice.color,
      percent: slice.percent,
    };
  });

  const combinedSiloLabelA =
    drawData.silo0Label === drawData.silo1Label
      ? ` and ${drawData.silo0Label}`
      : `, ${drawData.silo0Label}, and ${drawData.silo1Label}`;
  const combinedSiloLabelB = drawData.silo0Label.concat(
    drawData.silo0Label === drawData.silo1Label
      ? ''
      : ` and ${drawData.silo1Label}`
  );

  const firstHalfOfSlices = slices.slice(0, slices.length / 2).reverse();
  const secondHalfOfSlices = slices.slice(slices.length / 2);

  const tooltipContent = (
    <>
      As prices shift, tokens are moved between Uniswap{combinedSiloLabelA} to
      keep liquidity in range. Blend replicates Uniswap V2 payoffs with extreme
      capital efficiency, so most tokens can earn yield in {combinedSiloLabelB}.
      Value marked as {<em>"Float"</em>} helps facilitate gas-efficient
      withdrawals.
    </>
  );

  return (
    <div className='w-full flex flex-col items-start justify-start mb-8'>
      <WidgetHeading>
        Token Allocation{' '}
        <Tooltip
          buttonSize='S'
          content={tooltipContent}
          position='top-center'
          filled={true}
        />
      </WidgetHeading>
      <TokenAllocationWrapper>
        <div className='w-[227px] h-[227px] relative'>
          <PieChartContainer>
            <svg viewBox='-1 -1 2 2' overflow='visible'>
              {paths.map((path, index) => {
                return (
                  <ExpandingPath
                    key={index}
                    d={path.data}
                    fill={path.color}
                    onMouseEnter={() =>
                      onMouseEnter(index, path.percent.toString())
                    }
                    onMouseLeave={() => onMouseLeave()}
                  ></ExpandingPath>
                );
              })}
            </svg>
          </PieChartContainer>
          <PieChartLabel>{currentPercent}</PieChartLabel>
        </div>
        <TokenAllocationBreakdown>
          <div className='flex items-center gap-4 w-full'>
            <TokenLabel
              className={
                activeIndex !== -1 && activeIndex >= firstHalfOfSlices.length
                  ? 'inactive'
                  : ''
              }
            >
              {drawData.token0Label}
            </TokenLabel>
            <div className='w-64 flex flex-col'>
              {firstHalfOfSlices.map((slice, index) => {
                return (
                  <AllocationSection color={slice.color} key={index}>
                    <LabelWrapper>
                      <Text
                        size='L'
                        weight='medium'
                        color={
                          activeIndex !== -1 && activeIndex !== slice.index
                            ? 'rgba(255, 255, 255, 0.5)'
                            : 'rgba(255, 255, 255, 1)'
                        }
                      >
                        {slice.category}
                      </Text>
                    </LabelWrapper>
                    {slice.metric && (
                      <>
                        <DashedDivider />
                        <LabelWrapper>
                          <Text
                            size='M'
                            weight='medium'
                            color={
                              activeIndex !== -1 && activeIndex !== slice.index
                                ? 'rgba(255, 255, 255, 0.5)'
                                : 'rgba(236, 247, 255, 1)'
                            }
                          >
                            {slice.metric}
                          </Text>
                        </LabelWrapper>
                      </>
                    )}
                  </AllocationSection>
                );
              })}
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <TokenLabel
              className={
                activeIndex !== -1 && activeIndex < firstHalfOfSlices.length
                  ? 'inactive'
                  : ''
              }
            >
              {drawData.token1Label}
            </TokenLabel>
            <div className='w-64 flex flex-col'>
              {secondHalfOfSlices.map((slice, index) => {
                return (
                  <AllocationSection color={slice.color} key={index}>
                    <LabelWrapper>
                      <Text
                        size='L'
                        weight='medium'
                        color={
                          activeIndex !== -1 && activeIndex !== slice.index
                            ? 'rgba(255, 255, 255, 0.5)'
                            : 'rgba(255, 255, 255, 1)'
                        }
                      >
                        {slice.category}
                      </Text>
                    </LabelWrapper>
                    {slice.metric && (
                      <>
                        <DashedDivider />
                        <LabelWrapper>
                          <Text
                            size='M'
                            weight='medium'
                            color={
                              activeIndex !== -1 && activeIndex !== slice.index
                                ? 'rgba(255, 255, 255, 0.5)'
                                : 'rgba(236, 247, 255, 1)'
                            }
                          >
                            {slice.metric}
                          </Text>
                        </LabelWrapper>
                      </>
                    )}
                  </AllocationSection>
                );
              })}
            </div>
          </div>
        </TokenAllocationBreakdown>
      </TokenAllocationWrapper>
    </div>
  );
}
