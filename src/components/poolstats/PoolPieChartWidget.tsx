import React, { MouseEventHandler, useContext, useState } from 'react';
import WidgetHeading from '../common/WidgetHeading';
import styled from 'styled-components';
import tw from 'twin.macro';
import { BlendPoolData } from '../../data/BlendPoolData';
import { ResolveBlendPoolDrawData } from '../../data/BlendPoolDataResolver';

import { BlendPoolContext } from '../../data/context/BlendPoolContext';

export type PoolStatsWidgetProps = {
  poolData: BlendPoolData;
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

const PieChartContainer = styled.div`
  transform: rotate(90deg);

  perspective: 800px;
  perspective-origin: center;
`

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
    const offsetX = e.clientX - (boundingRect.x + currentTarget.offsetWidth / 2);
    const offsetY = e.clientY - (boundingRect.y + currentTarget.offsetHeight / 2);

    // Non-dimensionalize it (-1 to 1)
    const percentX = offsetX * 2 / currentTarget.offsetWidth;
    const percentY = offsetY * 2 / currentTarget.offsetHeight;

    const r = Math.hypot(percentX, percentY);
    let theta = Math.atan2(-percentX, percentY) * 180 / Math.PI;
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
}

type PieChartSlicePath = {
  data: string,
  color: string,
}

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
`

const PieChartLabel = styled.div.attrs<{visibility: boolean}>((props) => {
  console.log(props.visibility);
  return {
    style: { color: props.visibility ? 'white' : 'transparent' }
  }
})<{visibility: boolean}>`
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
  transition: all 0.15s linear;

  // colors, borders, text
  border-radius: calc(var(--height) / 2);
  ${tw`bg-grey-50 font-bold`};
`

export default function PoolPieChartWidget(props: PoolStatsWidgetProps) {
  const drawData = ResolveBlendPoolDrawData(props.poolData);
  const {mouseData, handleMouseMove, handleMouseLeave} = useMove();

  const { poolStats } = useContext(BlendPoolContext);

  const slices: PieChartSlice[] = [];
  if (poolStats) {
    const silo0_1 = poolStats.inventory0.silo.mul(poolStats.token1OverToken0);
    const float0_1 = poolStats.inventory0.float.mul(poolStats.token1OverToken0);
    const uni0_1 = poolStats.inventory0.uniswap.mul(poolStats.token1OverToken0);
    const uni1 = poolStats.inventory1.uniswap;
    const float1 = poolStats.inventory1.float;
    const silo1 = poolStats.inventory1.silo;

    slices[0] = {
      percent: silo0_1.div(poolStats.tvl_1).toNumber(),
      color: '#59D67C',
    };
    slices[1] = {
      percent: float0_1.div(poolStats.tvl_1).toNumber(),
      color: '#00C143',
    };
    slices[2] = {
      percent: uni0_1.div(poolStats.tvl_1).toNumber(),
      color: '#BEEDC7',
    };
    slices[3] = {
      percent: uni1.div(poolStats.tvl_1).toNumber(),
      color: '#BBA3F7',
    };
    slices[4] = {
      percent: float1.div(poolStats.tvl_1).toNumber(),
      color: '#6002EE',
    };
    slices[5] = {
      percent: silo1.div(poolStats.tvl_1).toNumber(),
      color: '#865EF2',
    };
  }

  let cumulativePercent = 0;
  const paths: PieChartSlicePath[] = slices.map((slice) => {
    // destructuring assignment sets the two variables at once
    const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
    // each slice starts where the last slice ended, so keep a cumulative percent
    cumulativePercent += slice.percent;
    const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
    // if the slice is more than 50%, take the large arc (the long way around)
    const largeArcFlag = slice.percent > .5 ? 1 : 0;

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
  let pieChartLabelText = '';
  for (const slice of slices) {
    cumulativePercent += slice.percent;

    if (cumulativePercent > mouseData.theta / 360.)  {
      pieChartLabelText = `${(slice.percent * 100).toFixed(2)}%`;
      break;
    }
  }

  return (
    <div className='w-full h-full rounded-md border-2 border-grey-200 flex flex-col items-start justify-start p-4'>
        <WidgetHeading>Token Allocation</WidgetHeading>
        <div className='w-full h-full grid grid-cols-2'>
          <div className='w-[200px] h-[200px] relative'>

            <PieChartContainer
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <svg
                viewBox="-1 -1 2 2"
                overflow="visible"
              >
                {paths.map((path) => {
                  return (
                    <ExpandingPath d={path.data} fill={path.color}></ExpandingPath>
                  );
                })}
              </svg>
            </PieChartContainer>

            <PieChartLabel visibility={mouseData.isActive && mouseData.r < 1.}>
              {pieChartLabelText}
            </PieChartLabel>

          </div>
          <div>
            Test
          </div>
        </div>
    </div>
  );
}
