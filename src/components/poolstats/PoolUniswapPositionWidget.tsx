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
  transition: all 0.1s linear;

  // colors, borders, text
  border-radius: calc(var(--height) / 2);
  ${tw`bg-grey-50 font-bold`};
`

const CategoryAndAPRLabel = styled.div<{color: string}>`
  position: relative;
  margin: 2px 0px;

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
`

type UniswapSegmentLabel = {
  content: string;
  alignment: string;
}

const UniswapPositionLabel = styled.div<{label: UniswapSegmentLabel}>`
  width: 4px;
  height: 100%;

  margin-bottom: 30px;

  z-index: 1000;

  position: relative;
  :before {
    position: absolute;
    height: 20px;
    top: 3px;

    ${({label}) => label.alignment === 'right' ? 'right: 50%;' : 'left: 50%;'}
    transform: translate(${({label}) => label.alignment === 'center' ? '-50%' : '0'}, 0);

    padding: 2px 6px;

    background: #11222E;
    border-radius: ${({label}) => {
      switch(label.alignment) {
        case 'left':
          return '0px 4px 4px 0px';
        case 'center':
          return '4px';
        case 'right':
          return '4px 0px 0px 4px';
      }
    }};

    content: '${({label}) => label.content}';
    text-align: ${({label}) => label.alignment};
    font-size: 0.75rem;
    font-family: 'Share Tech Mono';
    white-space: nowrap;
    color: white;
  }
`

const UniswapPriceLabel = styled.div<{label: UniswapSegmentLabel}>`
  width: 4px;
  height: 42px;

  margin-top: -8px;
  margin-right: 4px;
  margin-left: 4px;
  margin-bottom: 8px;

  background: #C2D1DD;

  position: relative;
  :before {
    position: absolute;
    height: 20px;
    top: 40px;

    ${({label}) => label.alignment === 'right' ? 'right: 50%;' : 'left: 50%;'}
    transform: translate(${({label}) => label.alignment === 'center' ? '-50%' : '0'}, 0);

    padding: 2px 6px;

    content: '${({label}) => label.content}';
    text-align: ${({label}) => label.alignment};
    font-family: 'Share Tech Mono';
    font-size: 0.75rem;
    text-transform: uppercase;
    white-space: nowrap;
    color: #C2D1DD;
  }
`

const UniswapSegment = styled.div<{width: number, breakStyle: string}>`
  width: ${({width}) => width}%;
  height: 26px;
  border-radius: 4px;

  position: relative;
  :before {
    position: absolute;
    ${({breakStyle}) => breakStyle === 'none' ? 'display: none;' : ''};
    ${({breakStyle}) => breakStyle === 'left' ? 'left: 30px;' : 'right: 30px;'}

    width: 6px;
    height: 100%;

    content: '';

    border-right: 4px solid #11222E;
    background: transparent;
    transform: skewX(-30deg);
  }
`

export default function PoolUniswapPositionWidget(props: PoolStatsWidgetProps) {
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
      color: TOKEN0_COLOR_SILO,
    };
    slices[1] = {
      percent: float0_1.div(poolStats.tvl_1).toNumber(),
      color: TOKEN0_COLOR_FLOAT,
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
      percent: float1.div(poolStats.tvl_1).toNumber(),
      color: TOKEN1_COLOR_FLOAT,
    };
    slices[5] = {
      percent: silo1.div(poolStats.tvl_1).toNumber(),
      color: TOKEN1_COLOR_SILO,
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
  let activeSliceIdx: number | null = null;
  let pieChartLabelText = '';
  for (let i = 0; i < slices.length; i++) {
    const slice = slices[i];
    cumulativePercent += slice.percent;

    if (cumulativePercent > mouseData.theta / 360.)  {
      activeSliceIdx = i;
      pieChartLabelText = `${(slice.percent * 100).toFixed(2)}%`;
      break;
    }
  }

  const combinedSiloLabelA = drawData.silo0Label === drawData.silo1Label
    ? `and ${drawData.silo0Label}`
    : `, ${drawData.silo0Label}, and ${drawData.silo1Label}`;
  const combinedSiloLabelB = drawData.silo0Label.concat(
    drawData.silo0Label === drawData.silo1Label
      ? ''
      : ` and ${drawData.silo1Label}`
  );

  const widths = [10, 20, 30, 40]

  return (
    <div className='w-full h-full rounded-md border-2 border-grey-200 flex flex-col items-start justify-start p-4 mb-8'>
        <WidgetHeading>Uniswap Position</WidgetHeading>
        <div className='w-full h-fit mt-4 flex flex-row flex-nowrap'>
          <UniswapPositionLabel
            label={{content: '0', alignment: 'left'}}
            className='text-xs' />
          <UniswapSegment
            width={30}
            breakStyle='none'
            className='bg-green-500' />
          <UniswapPositionLabel
            label={{content: '$2800', alignment: 'center'}}
            className='text-xs' />
          <UniswapSegment
            width={20}
            breakStyle='none'
            className='bg-green-700' />
          <UniswapPriceLabel
            label={{content: 'Current Price', alignment: 'center'}}
            className='text-xs' />
          <UniswapSegment
            width={20}
            breakStyle='none'
            className='bg-purple-700' />
          <UniswapPositionLabel
            label={{content: '$3200', alignment: 'center'}}
            className='text-xs' />
          <UniswapSegment
            width={30}
            breakStyle='none'
            className='bg-purple-500' />
          <UniswapPositionLabel
            label={{content: '∞', alignment: 'right'}}
            className='text-xs' />
        </div>
    </div>
  );
}
