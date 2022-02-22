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

type UniswapSegmentLabel = {
  content: string;
  alignment: string;
}

const UniswapSegmentLabelDiv = styled.div<{label: UniswapSegmentLabel}>`
  width: 4px;
  height: 100%;

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

const UniswapPriceLabel = styled.div`
  width: 2px;
  height: 42px;

  margin-top: -8px;
  margin-right: 4px;
  margin-left: 4px;

  background: #C2D1DD;
  animation: breathe 2s alternate infinite ease-in-out;

  position: relative;
  :before {
    position: absolute;
    height: 20px;
    top: 42px;

    left: 50%;
    transform: translate(-50%, 0);

    padding: 2px 6px;

    content: 'Current Price';
    text-align: center;
    font-family: 'Share Tech Mono';
    font-size: 0.75rem;
    text-transform: uppercase;
    white-space: nowrap;
  }

  @keyframes breathe {
    from {
      background: #C2D1DD;
      color: #C2D1DD;
    }
    to {
      background: white;
      color: white;
    }
  }
`

const UniswapSegment = styled.div<{width: number, breakStyle: string}>`
  width: ${({width}) => width}%;
  height: 26px;
  border-radius: 4px;
`

const InRangeIndicator = styled.div`
  width: 72px;
  height: 20px;

  margin-left: 8px;
  margin-bottom: 8px;

  background: white;
  border-radius: 2px;

  padding: 0px 6px;

  text-align: right;
  line-height: 20px;
  font-family: 'Share Tech Mono';
  font-size: 0.75rem;
  text-transform: uppercase;
  white-space: nowrap;
  color: #114E5B;

  position: relative;
  :after {
    position: absolute;
    width: 4px;
    aspect-ratio: 1;
    top: 8px;
    left: 6px;

    content: '';

    border-radius: 50%;

    animation: breatheA 2s alternate infinite ease-in-out;

    @keyframes breatheA {
      from {
        background: #114E5B;
        box-shadow: none;
      }
      to {
        background: blue;
        box-shadow: 0 0 3px 2px rgba(0, 0, 255, 0.4);
      }
    }
  }
`

export default function PoolUniswapPositionWidget(props: PoolStatsWidgetProps) {
  const drawData = ResolveBlendPoolDrawData(props.poolData);
  const {mouseData, handleMouseMove, handleMouseLeave} = useMove();

  const { poolStats } = useContext(BlendPoolContext);

  return (
    <div className='w-full h-full flex flex-col items-start justify-start mb-8'>
      <div className='flex flex-row items-center'>
        <WidgetHeading>Uniswap Position</WidgetHeading>
        <InRangeIndicator>In Range</InRangeIndicator>
      </div>
      <div className='w-full h-fit mt-4 flex flex-row flex-nowrap'>
        <UniswapSegment
          width={20}
          breakStyle='none'
          className='bg-green-500' />
        <UniswapSegmentLabelDiv
          label={{content: '$2800', alignment: 'center'}}
          className='text-xs' />
        <UniswapSegment
          width={30}
          breakStyle='none'
          className='bg-green-700' />
        <UniswapPriceLabel
          className='text-xs' />
        <UniswapSegment
          width={30}
          breakStyle='none'
          className='bg-purple-700' />
        <UniswapSegmentLabelDiv
          label={{content: '$3200', alignment: 'center'}}
          className='text-xs' />
        <UniswapSegment
          width={20}
          breakStyle='none'
          className='bg-purple-500' />
      </div>

      <div className='text-grey-700 text-md mt-8 pb-2'>
        Right now, this pool's liquidity stretches from $A and $B in Uniswap. Bots are incentivized
        to recenter the position every 24 hours, and it widens when prices are more volatile.
      </div>
    </div>
  );
}
