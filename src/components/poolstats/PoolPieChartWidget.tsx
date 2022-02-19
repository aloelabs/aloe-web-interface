import React, { useContext } from 'react';
import WidgetHeading from '../common/WidgetHeading';
import styled from 'styled-components';
import tw from 'twin.macro';
import { BlendPoolData } from '../../data/BlendPoolData';
import { ResolveBlendPoolDrawData } from '../../data/BlendPoolDataResolver';

import { BlendPoolContext } from '../../data/context/BlendPoolContext';
import { prettyFormatBalance, String1E, toBig } from '../../util/Numbers';
import { useAccount, useBalance } from 'wagmi';

export type PoolStatsWidgetProps = {
  poolData: BlendPoolData;
};

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

const PieChartContainer = styled.div`
  transform: rotate(90deg);
`

const ExpandingPath = styled.path`
  transition: all 0.15s ease-in;

  :hover {
    transform: scale(1.05);
  }
`

export default function PoolPieChartWidget(props: PoolStatsWidgetProps) {
  const drawData = ResolveBlendPoolDrawData(props.poolData);

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

  return (
    <div className='w-full h-84 rounded-md border-2 border-grey-200 flex flex-col items-start justify-start p-4'>
        <WidgetHeading>Token Allocation</WidgetHeading>
        <PieChartContainer className='w-[200px] h-[200px]'>
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
    </div>
  );
}
