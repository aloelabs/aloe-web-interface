import React, { useContext } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { formatDistance } from 'date-fns';
import { BlendPoolContext } from '../../data/context/BlendPoolContext';
import { OffChainPoolStats } from '../../data/PoolStats';
import { formatUSDAuto, roundPercentage } from '../../util/Numbers';
import { Display, Text } from '../common/Typography';
import WidgetHeading from '../common/WidgetHeading';
import { RESPONSIVE_BREAKPOINT_XS } from '../../data/constants/Breakpoints';

const ROUNDING_PRECISION = 2;
const POOL_STAT_LABEL_TEXT_COLOR = 'rgba(130, 160, 182, 1)';
const POOL_STAT_VALUE_TEXT_COLOR = 'rgba(255, 255, 255, 1)';
const IN_RANGE_COLOR = '#00C143';
const OUT_OF_RANGE_COLOR = POOL_STAT_VALUE_TEXT_COLOR; //'#EB5757';

const Wrapper = styled.div`
  ${tw`flex flex-col`}
  /* 16px due to the bottom padding already being 8px making the total space 24px */
  gap: 16px;
  margin-bottom: 64px;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_XS}) {
    margin-bottom: 48px;
  }
`;

const PoolStatsWidgetGrid = styled.div`
  display: grid;
  grid-template-columns: calc(50% - 12px) calc(50% - 12px);
  column-gap: 24px;
  border-top: 1px solid rgba(26, 41, 52, 1);

  @media (max-width: ${RESPONSIVE_BREAKPOINT_XS}) {
    grid-template-columns: 100%;
  }
`;

const PoolStat = styled.div`
  ${tw`flex`}
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 18px 8px;
  border-bottom: 1px solid rgba(26, 41, 52, 1);

  @media (max-width: ${RESPONSIVE_BREAKPOINT_XS}) {
    flex-direction: column;
    align-items: flex-start;
    padding: 8px 8px;
  }
`;

export type PoolStatsWidgetProps = {
  offChainPoolStats: OffChainPoolStats | undefined;
  uniswapVolume: number | null;
};

export default function PoolStatsWidget(props: PoolStatsWidgetProps) {
  const { offChainPoolStats, uniswapVolume } = props;

  const { poolStats } = useContext(BlendPoolContext);

  return (
    <Wrapper>
      <WidgetHeading>Stats</WidgetHeading>
      <PoolStatsWidgetGrid>
        <PoolStat>
          <Text size='S' weight='medium' color={POOL_STAT_LABEL_TEXT_COLOR}>
            APR (14d avg)
          </Text>
          <Display
            size='S'
            weight='semibold'
            color={POOL_STAT_VALUE_TEXT_COLOR}
          >
            {offChainPoolStats
              ? roundPercentage(
                  100 * offChainPoolStats.annual_percentage_rate,
                  ROUNDING_PRECISION
                )
                  .toFixed(ROUNDING_PRECISION)
                  .concat('%')
              : '--'}
          </Display>
        </PoolStat>
        <PoolStat>
          <Text size='S' weight='medium' color={POOL_STAT_LABEL_TEXT_COLOR}>
            Uniswap Position
          </Text>
          <Display
            size='S'
            weight='semibold'
            color={poolStats ? (poolStats.isInRange ? IN_RANGE_COLOR : OUT_OF_RANGE_COLOR) : POOL_STAT_VALUE_TEXT_COLOR}
          >
            {poolStats ? (poolStats.isInRange ? 'In-Range' : 'Out-of-Range') : '--'}
          </Display>
        </PoolStat>
        <PoolStat>
          <Text size='S' weight='medium' color={POOL_STAT_LABEL_TEXT_COLOR}>
            24H Uniswap Volume
          </Text>
          <Display
            size='S'
            weight='semibold'
            color={POOL_STAT_VALUE_TEXT_COLOR}
          >
            {formatUSDAuto(uniswapVolume, '--')}
          </Display>
        </PoolStat>
        <PoolStat>
          <Text size='S' weight='medium' color={POOL_STAT_LABEL_TEXT_COLOR}>
            Implied Volatility
          </Text>
          <Display
            size='S'
            weight='semibold'
            color={POOL_STAT_VALUE_TEXT_COLOR}
          >
            {poolStats
              ? roundPercentage(100 * poolStats.IV, ROUNDING_PRECISION)
                  .toFixed(ROUNDING_PRECISION)
                  .concat('%')
              : '--'}
          </Display>
        </PoolStat>
        <PoolStat>
          <Text size='S' weight='medium' color={POOL_STAT_LABEL_TEXT_COLOR}>
            TVL
          </Text>
          <Display
            size='S'
            weight='semibold'
            color={POOL_STAT_VALUE_TEXT_COLOR}
          >
            {formatUSDAuto(offChainPoolStats?.total_value_locked || null, '--')}
          </Display>
        </PoolStat>
        <PoolStat>
          <Text size='S' weight='medium' color={POOL_STAT_LABEL_TEXT_COLOR}>
            Last Rebalance
          </Text>
          <Display
            size='S'
            weight='semibold'
            color={POOL_STAT_VALUE_TEXT_COLOR}
          >
            {poolStats
              ? formatDistance(poolStats.recenterTimestamp * 1000, Date.now(), {
                  addSuffix: true,
                })
              : '--'}
          </Display>
        </PoolStat>
      </PoolStatsWidgetGrid>
    </Wrapper>
  );
}
