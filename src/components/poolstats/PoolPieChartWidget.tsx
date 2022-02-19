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

const Pie = styled.div<{ segmentTurns: number[] }>`
  width: 200px;
  height: 200px;

  border-radius: 50%;

  transform: rotate(0.5turn);

  background: conic-gradient(
    #59D67C ${({segmentTurns}) => segmentTurns[0]}turn,
    ${({segmentTurns}) => segmentTurns[0]}turn,
    #00C143 ${({segmentTurns}) => segmentTurns[1]}turn,
    ${({segmentTurns}) => segmentTurns[1]}turn,
    #BEEDC7 ${({segmentTurns}) => segmentTurns[2]}turn,
    ${({segmentTurns}) => segmentTurns[2]}turn,
    #BBA3F7 ${({segmentTurns}) => segmentTurns[3]}turn,
    ${({segmentTurns}) => segmentTurns[3]}turn,
    #6002EE ${({segmentTurns}) => segmentTurns[4]}turn,
    ${({segmentTurns}) => segmentTurns[4]}turn,
    #865EF2 0turn
  );
`

const PieSlice = styled.div<{ color: string, turns: number[] }>`
  position: absolute;

  width: 200px;
  height: 200px;

  border-radius: 50%;

  background: conic-gradient(
    ${({color}) => color} ${({turns}) => turns[1]}turn,
    ${({turns}) => turns[1]}turn,
    transparent 0turn
  );

  transition: all 0.2s ease-in-out;
  transform: rotate(${({turns}) => turns[0]}turn);
  :hover {
    transform: rotate(${({turns}) => turns[0]}turn) scale(1.05);
  }
`

export default function PoolPieChartWidget(props: PoolStatsWidgetProps) {
  const drawData = ResolveBlendPoolDrawData(props.poolData);

  const { poolStats } = useContext(BlendPoolContext);

  const pieChartSegments = [0, 0, 0, 0, 0];
  if (poolStats) {
    const silo0_1 = poolStats.inventory0.silo.mul(poolStats.token1OverToken0);
    const float0_1 = poolStats.inventory0.float.mul(poolStats.token1OverToken0);
    const uni0_1 = poolStats.inventory0.uniswap.mul(poolStats.token1OverToken0);
    const uni1 = poolStats.inventory1.uniswap;
    const float1 = poolStats.inventory1.float;
    const silo1 = poolStats.inventory1.silo;

    pieChartSegments[0] = silo0_1.div(poolStats.tvl_1).toNumber();
    pieChartSegments[1] = pieChartSegments[0] + float0_1.div(poolStats.tvl_1).toNumber();
    pieChartSegments[2] = pieChartSegments[1] + uni0_1.div(poolStats.tvl_1).toNumber();
    pieChartSegments[3] = pieChartSegments[2] + uni1.div(poolStats.tvl_1).toNumber();
    pieChartSegments[4] = pieChartSegments[3] + float1.div(poolStats.tvl_1).toNumber();
    pieChartSegments[5] = pieChartSegments[4] + silo1.div(poolStats.tvl_1).toNumber();
  }

//   const [{ data: accountData }] = useAccount();
//   const [{ data: shareBalanceData }] = useBalance({
//     addressOrName: accountData?.address,
//     token: props.poolData.poolAddress,
//     watch: true,
//   });

//   const sharesBalance = shareBalanceData
//     ? toBig(shareBalanceData.value)
//     : undefined;

//   const token0Reserves = prettyFormatBalance(
//     poolStats?.inventory0.total,
//     poolStats?.token0Decimals
//   );
//   const token1Reserves = prettyFormatBalance(
//     poolStats?.inventory1.total,
//     poolStats?.token1Decimals
//   );

//   const token0OwedToUser =
//     !poolStats || !sharesBalance || poolStats.outstandingShares.eq(0)
//       ? '-'
//       : prettyFormatBalance(
//           poolStats.inventory0.total
//             .mul(sharesBalance)
//             .div(poolStats.outstandingShares),
//           poolStats.token0Decimals
//         );
//   const token1OwedToUser =
//     !poolStats || !sharesBalance || poolStats.outstandingShares.eq(0)
//       ? '-'
//       : prettyFormatBalance(
//           poolStats.inventory1.total
//             .mul(sharesBalance)
//             .div(poolStats.outstandingShares),
//           poolStats.token1Decimals
//         );
//   const poolSharesBalance = sharesBalance
//     ? sharesBalance.div(String1E(18)).toExponential(4)
//     : '-';

  return (
    <div className='w-full h-84 rounded-md border-2 border-grey-200 flex flex-col items-start justify-start p-4'>
        <WidgetHeading>Token Allocation</WidgetHeading>
        <Pie segmentTurns={pieChartSegments}></Pie>
        {/* <div className='relative w-[200px] h-[200px]'>
            <PieSlice color={'white'} turns={[0, 0.1]} />
            <PieSlice color={'red'} turns={[0.1, 0.1]} />
            <PieSlice color={'blue'} turns={[0.2, 0.1]} />
            <PieSlice color={'black'} turns={[0.3, 0.1]} />
        </div> */}
    </div>
  );
}
