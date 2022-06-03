import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { BlendPoolMarkers } from '../../data/BlendPoolMarkers';
import { RESPONSIVE_BREAKPOINT_MD } from '../../data/constants/Breakpoints';
import { formatUSD } from '../../util/Numbers';
import PercentChange from '../common/PercentChange';
import WidgetHeading from '../common/WidgetHeading';

const Wrapper = styled.div`
  ${tw`flex flex-col`}
  width: 100%;
  /* 16px due to the bottom padding already being 8px making the total space 24px */
  gap: 16px;
  margin-bottom: 64px;
`;

const PerformanceCardGrid = styled.div`
  display: grid;
  grid-template-columns: calc(50% - 8px) calc(50% - 8px);
  grid-template-rows: 1fr 1fr;
  gap: 16px;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_MD}) {
    grid-template-columns: 1fr;
  }
`;

const PerformanceCard = styled.div`
  ${tw`flex flex-col items-start justify-center`}
  gap: 8px;
  padding: 24px 32px;
  border-radius: 8px;
  background-color: rgba(13, 23, 30, 1);
`;

const PerformanceLabel = styled.span`
  font-size: 16px;
  line-height: 24px;
  color: rgba(130, 160, 182, 1);
`;

const PerformanceValue = styled.span`
  ${tw`flex items-center gap-4`}
  font-size: 32px;
  font-weight: 600;
  line-height: 40px;
`;

export type PoolPositionWidgetProps = {
  poolData: BlendPoolMarkers;
};

export default function PoolPositionWidget(props: PoolPositionWidgetProps) {
  // TODO: Incorporate the pool data into the widget
  return (
    <Wrapper>
      <WidgetHeading>Your Position</WidgetHeading>
      <PerformanceCardGrid>
        <PerformanceCard>
          <PerformanceLabel>Total Value</PerformanceLabel>
          <PerformanceValue>{formatUSD(0)}</PerformanceValue>
        </PerformanceCard>
        <PerformanceCard>
          <PerformanceLabel>Average Price Per Share</PerformanceLabel>
          <PerformanceValue>{formatUSD(0)}</PerformanceValue>
        </PerformanceCard>
        <PerformanceCard>
          <PerformanceLabel>Today's Return</PerformanceLabel>
          <PerformanceValue>
            {formatUSD(0)} <PercentChange percent={0} />
          </PerformanceValue>
        </PerformanceCard>
        <PerformanceCard>
          <PerformanceLabel>Total Returns</PerformanceLabel>
          <PerformanceValue>
            {formatUSD(0)} <PercentChange percent={0} />
          </PerformanceValue>
        </PerformanceCard>
      </PerformanceCardGrid>
    </Wrapper>
  );
}
