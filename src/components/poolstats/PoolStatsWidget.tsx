import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { PoolStats } from '../../data/PoolStats';
import {
  roundPercentage
} from '../../util/Numbers';
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
  poolStats: PoolStats | undefined;
};

export default function PoolStatsWidget(props: PoolStatsWidgetProps) {
  const { poolStats } = props;

  return (
    <Wrapper>
      <WidgetHeading>Stats</WidgetHeading>
      <PoolStatsWidgetGrid>
        <PoolStat>
          <Text size='S' weight='medium' color={POOL_STAT_LABEL_TEXT_COLOR}>
            APR
          </Text>
          <Display
            size='S'
            weight='semibold'
            color={POOL_STAT_VALUE_TEXT_COLOR}
          >
            {roundPercentage(
              poolStats?.annualPercentageRate || 0,
              ROUNDING_PRECISION
            )}
            %
          </Display>
        </PoolStat>
        <PoolStat>
          <Text size='S' weight='medium' color={POOL_STAT_LABEL_TEXT_COLOR}>
            CAPR
          </Text>
          <Display
            size='S'
            weight='semibold'
            color={POOL_STAT_VALUE_TEXT_COLOR}
          >
            {roundPercentage(23, ROUNDING_PRECISION)}%
          </Display>
        </PoolStat>
        <PoolStat>
          <Text size='S' weight='medium' color={POOL_STAT_LABEL_TEXT_COLOR}>
            Volume 24H
          </Text>
          <Display
            size='S'
            weight='semibold'
            color={POOL_STAT_VALUE_TEXT_COLOR}
          >
            $125.30 M
          </Display>
        </PoolStat>
        <PoolStat>
          <Text size='S' weight='medium' color={POOL_STAT_LABEL_TEXT_COLOR}>
            Liquidity
          </Text>
          <Display
            size='S'
            weight='semibold'
            color={POOL_STAT_VALUE_TEXT_COLOR}
          >
            $125.30 M
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
            {(poolStats?.totalValueLocked || 0).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </Display>
        </PoolStat>
        <PoolStat>
          <Text size='S' weight='medium' color={POOL_STAT_LABEL_TEXT_COLOR}>
            Lorem Ipsum
          </Text>
          <Display
            size='S'
            weight='semibold'
            color={POOL_STAT_VALUE_TEXT_COLOR}
          >
            $125.30 M
          </Display>
        </PoolStat>
      </PoolStatsWidgetGrid>
    </Wrapper>
  );
}
