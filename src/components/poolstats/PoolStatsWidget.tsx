import React, { useContext } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { BlendPoolMarkers } from '../../data/BlendPoolMarkers';
import { ResolveBlendPoolDrawData } from '../../data/BlendPoolDataResolver';

import { BlendPoolContext } from '../../data/context/BlendPoolContext';
import {
  prettyFormatBalance,
  roundPercentage,
  String1E,
  toBig,
} from '../../util/Numbers';
import { useAccount, useBalance } from 'wagmi';
import { Display, Text } from '../common/Typography';
import WidgetHeading from '../common/WidgetHeading';

const ROUNDING_PRECISION = 2;
const POOL_STAT_LABEL_TEXT_COLOR = 'rgba(130, 160, 182, 1)';
const POOL_STAT_VALUE_TEXT_COLOR = 'rgba(255, 255, 255, 1)';

const Wrapper = styled.div`
  ${tw`flex flex-col`}
  /* 16px due to the bottom padding already being 8px making the total space 24px */
  gap: 16px;
  margin-bottom: 64px;
`;

const PoolStatsWidgetGrid = styled.div`
  display: grid;
  grid-template-columns: calc(50% - 12px) calc(50% - 12px);
  column-gap: 24px;
  border-top: 1px solid rgba(26, 41, 52, 1);
`;

const PoolStat = styled.div`
  ${tw`flex items-center justify-between`}
  padding: 18px 8px;
  border-bottom: 1px solid rgba(26, 41, 52, 1);
`;

export type PoolStatsWidgetProps = {
  poolData: BlendPoolMarkers;
};

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
    <Wrapper>
      <WidgetHeading>Stats</WidgetHeading>
      <PoolStatsWidgetGrid>
        <PoolStat>
          <Text size='S' weight='medium' color={POOL_STAT_LABEL_TEXT_COLOR}>APR</Text>
          <Display size='S' weight='semibold' color={POOL_STAT_VALUE_TEXT_COLOR}>
            {roundPercentage(12, ROUNDING_PRECISION)}%
          </Display>
        </PoolStat>
        <PoolStat>
          <Text size='S' weight='medium' color={POOL_STAT_LABEL_TEXT_COLOR}>CAPR</Text>
          <Display size='S' weight='semibold' color={POOL_STAT_VALUE_TEXT_COLOR}>
            {roundPercentage(23, ROUNDING_PRECISION)}%
          </Display>
        </PoolStat>
        <PoolStat>
          <Text size='S' weight='medium' color={POOL_STAT_LABEL_TEXT_COLOR}>Volume 24H</Text>
          <Display size='S' weight='semibold' color={POOL_STAT_VALUE_TEXT_COLOR}>$125.30 M</Display>
        </PoolStat>
        <PoolStat>
          <Text size='S' weight='medium' color={POOL_STAT_LABEL_TEXT_COLOR}>Liquidity</Text>
          <Display size='S' weight='semibold' color={POOL_STAT_VALUE_TEXT_COLOR}>$125.30 M</Display>
        </PoolStat>
        <PoolStat>
          <Text size='S' weight='medium' color={POOL_STAT_LABEL_TEXT_COLOR}>TVL</Text>
          <Display size='S' weight='semibold' color={POOL_STAT_VALUE_TEXT_COLOR}>$125.30 M</Display>
        </PoolStat>
        <PoolStat>
          <Text size='S' weight='medium' color={POOL_STAT_LABEL_TEXT_COLOR}>Lorem Ipsum</Text>
          <Display size='S' weight='semibold' color={POOL_STAT_VALUE_TEXT_COLOR}>$125.30 M</Display>
        </PoolStat>
      </PoolStatsWidgetGrid>
    </Wrapper>
  );
}
