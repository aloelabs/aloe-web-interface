import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { BlendPoolMarkers } from '../../data/BlendPoolMarkers';
import { RESPONSIVE_BREAKPOINT_MD } from '../../data/constants/Breakpoints';
import { PercentChange } from '../common/PercentChange';
import { Display, Text } from '../common/Typography';
import WidgetHeading from '../common/WidgetHeading';

const PERFORMANCE_LABEL_TEXT_COLOR = 'rgba(130, 160, 182, 1)';
const PERFORMANCE_VALUE_TEXT_COLOR = 'rgba(255, 255, 255, 1)';

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
          <Text size='M' weight='medium' color={PERFORMANCE_LABEL_TEXT_COLOR}>Today's Return</Text>
          <div className='flex items-center gap-4'>
            <Display size='L' weight='semibold' color={PERFORMANCE_VALUE_TEXT_COLOR}>
              TODO
            </Display>
            <PercentChange percent={0} />
          </div>
        </PerformanceCard>
        <PerformanceCard>
          <Text size='M' weight='medium' color={PERFORMANCE_LABEL_TEXT_COLOR}>Total Returns</Text>
          <div className='flex items-center gap-4'>
            <Display size='L' weight='semibold' color={PERFORMANCE_VALUE_TEXT_COLOR}>
              TODO
            </Display>
            <PercentChange percent={0} />
          </div>
        </PerformanceCard>
        <PerformanceCard>
          <Text size='M' weight='medium' color={PERFORMANCE_LABEL_TEXT_COLOR}>Total Value</Text>
          <Display size='L' weight='semibold' color={PERFORMANCE_VALUE_TEXT_COLOR}>TODO</Display>
        </PerformanceCard>
      </PerformanceCardGrid>
    </Wrapper>
  );
}
