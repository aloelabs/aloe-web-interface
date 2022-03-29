import React, { MouseEventHandler, useContext, useState } from 'react';
import WidgetHeading from '../common/WidgetHeading';
import styled from 'styled-components';
import tw from 'twin.macro';
import { BlendPoolMarkers } from '../../data/BlendPoolMarkers';
import { ResolveBlendPoolDrawData } from '../../data/BlendPoolDataResolver';

import { BlendPoolContext } from '../../data/context/BlendPoolContext';

export type PoolStatsWidgetProps = {
  poolData: BlendPoolMarkers;
};

// MARK: Capturing Mouse Data on container div ---------------------------------------

interface MouseMoveData {
  x: number;
  y: number;
  r: number;
  theta: number;
  isActive: boolean;
}

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

const useMove = () => {
  const [state, setState] = useState<MouseMoveData>({
    x: 0,
    y: 0,
    r: 0,
    theta: 0,
    isActive: false,
  });

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    const currentTarget = e.currentTarget;
    const boundingRect = currentTarget.getBoundingClientRect();

    // Compute pointer's offset from center of element (in pixels)
    const offsetX =
      e.clientX - (boundingRect.x + currentTarget.offsetWidth / 2);
    const offsetY =
      e.clientY - (boundingRect.y + currentTarget.offsetHeight / 2);

    // Non-dimensionalize it (-1 to 1)
    const percentX = (offsetX * 2) / currentTarget.offsetWidth;
    const percentY = (offsetY * 2) / currentTarget.offsetHeight;

    const r = Math.hypot(percentX, percentY);
    let theta = (Math.atan2(-percentX, percentY) * 180) / Math.PI;
    if (theta < 0) theta += 360;

    setState((state) => {
      const data: MouseMoveData = {
        ...state,
        x: percentX,
        y: percentY,
        r,
        theta,
        isActive: true,
      };

      return data;
    });
  };

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = (e) => {
    setState((state) => ({ ...state, isActive: false }));
  };

  return {
    mouseData: state,
    handleMouseMove,
    handleMouseLeave,
  };
};

// MARK: Pie chart setup -------------------------------------------------------------

type PieChartSlice = {
  percent: number;
  color: string;
};

type PieChartSlicePath = {
  data: string;
  color: string;
};

function getCoordinatesForPercent(percent: number) {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x, y];
}

const ExpandingPath = styled.path`
  transition: all 0.15s ease-in;

  :hover {
    transform: scale(${PIE_CHART_HOVER_GROWTH});
  }
`;

const PieChartLabel = styled.div.attrs<{ shouldShow: boolean }>((props) => {
  return {
    style: { color: props.shouldShow ? 'white' : 'transparent' },
  };
})<{ shouldShow: boolean }>`
  --width: 90px;
  --height: 90px;

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
  ${tw`bg-grey-50 font-bold`};
`;

const CategoryAndAPRLabel = styled.div<{ color: string }>`
  position: relative;
  margin: 2px 0px;
  white-space: nowrap;

  :before {
    content: '';

    position: absolute;
    top: 50%;
    left: -22px;

    height: 8px;
    aspect-ratio: 1;
    margin-top: -4px;

    border-radius: 50%;
    background: ${({ color }) => color};
  }
`;

export default function PoolPieChartWidget(props: PoolStatsWidgetProps) {
  const drawData = ResolveBlendPoolDrawData(props.poolData);
  const { mouseData, handleMouseMove, handleMouseLeave } = useMove();

  const { poolStats } = useContext(BlendPoolContext);

  const slices: PieChartSlice[] = [];
  if (poolStats) {
    const silo0_1 = poolStats.inventory0.silo.mul(poolStats.token1OverToken0);
    const float0_1 = poolStats.inventory0.float.mul(poolStats.token1OverToken0);
    const uni0_1 = poolStats.inventory0.uniswap.mul(poolStats.token1OverToken0);
    const uni1 = poolStats.inventory1.uniswap;
    const float1 = poolStats.inventory1.float;
    const silo1 = poolStats.inventory1.silo;

    if (poolStats.tvl_1.gt(0)) {
      slices[0] = {
        percent: float0_1.div(poolStats.tvl_1).toNumber(),
        color: TOKEN0_COLOR_FLOAT,
      };
      slices[1] = {
        percent: silo0_1.div(poolStats.tvl_1).toNumber(),
        color: TOKEN0_COLOR_SILO,
      };
      slices[2] = {
        percent: uni0_1.div(poolStats.tvl_1).toNumber(),
        color: TOKEN0_COLOR_UNISWAP,
      };
      slices[3] = {
        percent: uni1.div(poolStats.tvl_1).toNumber(),
        color: TOKEN1_COLOR_UNISWAP,
      };
      slices[4] = {
        percent: silo1.div(poolStats.tvl_1).toNumber(),
        color: TOKEN1_COLOR_SILO,
      };
      slices[5] = {
        percent: float1.div(poolStats.tvl_1).toNumber(),
        color: TOKEN1_COLOR_FLOAT,
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
    };
  });

  cumulativePercent = 0;
  let activeSliceIdx: number | null = null;
  let pieChartLabelText = '';
  for (let i = 0; i < slices.length; i++) {
    const slice = slices[i];
    cumulativePercent += slice.percent;

    if (cumulativePercent > mouseData.theta / 360) {
      activeSliceIdx = i;
      pieChartLabelText = `${(slice.percent * 100).toFixed(2)}%`;
      break;
    }
  }

  const combinedSiloLabelA =
    drawData.silo0Label === drawData.silo1Label
      ? ` and ${drawData.silo0Label}`
      : `, ${drawData.silo0Label}, and ${drawData.silo1Label}`;
  const combinedSiloLabelB = drawData.silo0Label.concat(
    drawData.silo0Label === drawData.silo1Label
      ? ''
      : ` and ${drawData.silo1Label}`
  );

  const mouseIsInsidePieChart = mouseData.isActive && mouseData.r < 1;

  return (
    <div className='w-full flex flex-col items-start justify-start mb-8'>
      <WidgetHeading>Token Allocation</WidgetHeading>
      <div className='w-full h-full mt-4 flex flex-row flex-nowrap'>
        <div className='w-[200px] h-[200px] relative'>
          <PieChartContainer
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <svg viewBox='-1 -1 2 2' overflow='visible'>
              {paths.map((path, index) => {
                return (
                  <ExpandingPath
                    key={index}
                    d={path.data}
                    fill={path.color}
                  ></ExpandingPath>
                );
              })}
            </svg>
          </PieChartContainer>

          <PieChartLabel shouldShow={mouseIsInsidePieChart}>
            {pieChartLabelText}
          </PieChartLabel>
        </div>
        <div className='flex flex-col flex-nowrap ml-8'>
          <div className='h-1/2 flex flex-row flex-nowrap justify-start items-center'>
            <div className='font-semibold w-14'>{drawData.token0Label}</div>
            <div className='border-2 border-grey-300 h-[60%] mx-[16px]' />
            <div className='grid grid-rows-3'>
              <CategoryAndAPRLabel
                color={TOKEN0_COLOR_UNISWAP}
                className={
                  mouseIsInsidePieChart && activeSliceIdx === 2
                    ? 'text-white'
                    : 'text-grey-600'
                }
              >
                Uniswap
              </CategoryAndAPRLabel>
              <CategoryAndAPRLabel
                color={TOKEN0_COLOR_SILO}
                className={
                  mouseIsInsidePieChart && activeSliceIdx === 1
                    ? 'text-white'
                    : 'text-grey-600'
                }
              >
                {drawData.silo0Label}
              </CategoryAndAPRLabel>
              <CategoryAndAPRLabel
                color={TOKEN0_COLOR_FLOAT}
                className={
                  mouseIsInsidePieChart && activeSliceIdx === 0
                    ? 'italic text-white'
                    : 'italic text-grey-600'
                }
              >
                Float
              </CategoryAndAPRLabel>
            </div>
          </div>
          <div className='h-1/2 flex flex-row flex-nowrap justify-start items-center'>
            <div className='font-semibold w-14'>{drawData.token1Label}</div>
            <div className='border-2 border-grey-300 h-[60%] mx-[16px]' />
            <div className='grid grid-rows-3'>
              <CategoryAndAPRLabel
                color={TOKEN1_COLOR_UNISWAP}
                className={
                  mouseIsInsidePieChart && activeSliceIdx === 3
                    ? 'text-white'
                    : 'text-grey-600'
                }
              >
                Uniswap
              </CategoryAndAPRLabel>
              <CategoryAndAPRLabel
                color={TOKEN1_COLOR_SILO}
                className={
                  mouseIsInsidePieChart && activeSliceIdx === 4
                    ? 'text-white'
                    : 'text-grey-600'
                }
              >
                {drawData.silo1Label}
              </CategoryAndAPRLabel>
              <CategoryAndAPRLabel
                color={TOKEN1_COLOR_FLOAT}
                className={
                  mouseIsInsidePieChart && activeSliceIdx === 5
                    ? 'italic text-white'
                    : 'italic text-grey-600'
                }
              >
                Float
              </CategoryAndAPRLabel>
            </div>
          </div>
        </div>
      </div>

      <div className='text-grey-700 text-md mt-6 pb-2'>
        As prices shift, tokens are moved between Uniswap{combinedSiloLabelA} to
        keep liquidity in range. Blend replicates Uniswap V2 payoffs with
        extreme capital efficiency, so most tokens can earn yield in{' '}
        {combinedSiloLabelB}. Value marked as <i>"Float"</i> helps facilitate
        gas-efficient withdrawals.
      </div>
    </div>
  );
}