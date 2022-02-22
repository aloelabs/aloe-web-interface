import React, { useContext } from 'react';
import WidgetHeading from '../common/WidgetHeading';
import styled from 'styled-components';
import tw from 'twin.macro';
import { BlendPoolMarkers } from '../../data/BlendPoolMarkers';
import { ResolveBlendPoolDrawData } from '../../data/BlendPoolDataResolver';

import { BlendPoolContext } from '../../data/context/BlendPoolContext';
import { prettyFormatBalance, String1E, toBig } from '../../util/Numbers';
import { useAccount, useBalance } from 'wagmi';

export type PoolStatsWidgetProps = {
  poolData: BlendPoolMarkers;
};

const HorizDivider = styled.div`
  ${tw`w-full px-4 border-t-2 border-t-grey-200 h-0`}
`;

const Card = styled.div`
  ${tw`w-full py-2 flex flex-row items-center justify-between hover:bg-grey-75`}
`;

export default function PoolStatsWidget(props: PoolStatsWidgetProps) {
  const drawData = ResolveBlendPoolDrawData(props.poolData);

  const { poolStats } = useContext(BlendPoolContext);

  const [{ data: accountData }] = useAccount();
  const [{ data: shareBalanceData }] = useBalance({
    addressOrName: accountData?.address,
    token: props.poolData.poolAddress,
    watch: true,
  });

  const sharesBalance = shareBalanceData
    ? toBig(shareBalanceData.value)
    : undefined;

  const token0Reserves = prettyFormatBalance(
    poolStats?.inventory0.total,
    poolStats?.token0Decimals
  );
  const token1Reserves = prettyFormatBalance(
    poolStats?.inventory1.total,
    poolStats?.token1Decimals
  );

  const token0OwedToUser =
    !poolStats || !sharesBalance || poolStats.outstandingShares.eq(0)
      ? '-'
      : prettyFormatBalance(
          poolStats.inventory0.total
            .mul(sharesBalance)
            .div(poolStats.outstandingShares),
          poolStats.token0Decimals
        );
  const token1OwedToUser =
    !poolStats || !sharesBalance || poolStats.outstandingShares.eq(0)
      ? '-'
      : prettyFormatBalance(
          poolStats.inventory1.total
            .mul(sharesBalance)
            .div(poolStats.outstandingShares),
          poolStats.token1Decimals
        );
  const poolSharesBalance = sharesBalance
    ? sharesBalance.div(String1E(18)).toExponential(4)
    : '-';

  return (
    <div className='w-full flex flex-col items-start justify-start'>
      <WidgetHeading>Vault Usage</WidgetHeading>
      <div className='w-full flex flex-col items-start justify-start pb-4 text-grey-800'>
        {/*<Card>*/}
        {/*  <span>TVL</span>*/}
        {/*  <span>-</span>*/}
        {/*</Card>*/}
        {/*<HorizDivider />*/}
        <Card>
          <span>
            <span className='font-semibold text-grey-1000'>
              {drawData.token0Label}
            </span>
            &nbsp;Reserves
          </span>
          <span>
            {token0Reserves}&nbsp;
            <span className='font-semibold text-grey-1000'>
              {drawData.token0Label}
            </span>
          </span>
        </Card>
        <HorizDivider />
        <Card>
          <span>
            <span className='font-semibold text-grey-1000'>
              {drawData.token1Label}
            </span>
            &nbsp;Reserves
          </span>
          <span>
            {token1Reserves}&nbsp;
            <span className='font-semibold text-grey-1000'>
              {drawData.token1Label}
            </span>
          </span>
        </Card>
        <HorizDivider />
      </div>
      {/*User Stats*/}
      <WidgetHeading>Your&nbsp;Position</WidgetHeading>
      <div className='w-full flex flex-col items-start justify-start text-grey-800'>
        <Card>
          <span>Shares</span>
          <span>{poolSharesBalance}</span>
        </Card>
        <HorizDivider />
        {/*<Card>*/}
        {/*  <span>Value</span>*/}
        {/*  <span>-</span>*/}
        {/*</Card>*/}
        {/*<HorizDivider />*/}
        <Card>
          <span>
            <span className='font-semibold text-grey-1000'>
              {drawData.token0Label}
            </span>
            &nbsp;Holdings
          </span>
          <span>
            {token0OwedToUser}&nbsp;
            <span className='font-semibold text-grey-1000'>
              {drawData.token0Label}
            </span>
          </span>
        </Card>
        <HorizDivider />
        <Card>
          <span>
            <span className='font-semibold text-grey-1000'>
              {drawData.token1Label}
            </span>
            &nbsp;Holdings
          </span>
          <span>
            {token1OwedToUser}&nbsp;
            <span className='font-semibold text-grey-1000'>
              {drawData.token1Label}
            </span>
          </span>
        </Card>
      </div>
    </div>
  );
}
