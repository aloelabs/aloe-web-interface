import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { BlendPoolMarkers } from '../../data/BlendPoolMarkers';
import { Display, Text } from '../common/Typography';

const METRIC_LABEL_TEXT_COLOR = 'rgba(130, 160, 182, 1)';
const METRIC_VALUE_TEXT_COLOR = 'rgba(255, 255, 255, 1)';

const Wrapper = styled.div`
  ${tw`flex p-8 relative`}
  background-color: rgba(10, 20, 27, 1);
  border-radius: 8px;
  margin-bottom: 48px;

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: 8px;
    /* 1.25px instead of 1px since it avoids tbe buggy appearance */
    padding: 1.25px;
    background: linear-gradient(90deg, #9baaf3 0%, #7bd8c0 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
`;

const VerticalDivider = styled.div`
  width: 1px;
  margin-left: 32px;
  margin-right: 32px;
  background-color: rgba(43, 64, 80, 1);
`;

export type BrowsePoolsPerformanceProps = {
  poolData: BlendPoolMarkers[];
};

export default function BrowsePoolsPerformance(
  props: BrowsePoolsPerformanceProps
) {
  return (
    <Wrapper>
      <div className='flex flex-col gap-3 flex-grow p-4'>
        <Text size='L' weight='medium' color={METRIC_LABEL_TEXT_COLOR}>Total Value Invested</Text>
        <Display size='L' weight='medium' color={METRIC_VALUE_TEXT_COLOR}>$1.394M</Display>
      </div>
      <VerticalDivider />
      <div className='flex flex-col gap-3 flex-grow p-4'>
        <Text size='L' weight='medium' color={METRIC_LABEL_TEXT_COLOR}>Pools Deployed</Text>
        <Display size='L' weight='medium' color={METRIC_VALUE_TEXT_COLOR}>{props.poolData.length} Pools</Display>
      </div>
      <VerticalDivider />
      <div className='flex flex-col gap-3 flex-grow p-4'>
        <Text size='L' weight='medium' color={METRIC_LABEL_TEXT_COLOR}>Total Aloe Users</Text>
        <Display size='L' weight='medium' color={METRIC_VALUE_TEXT_COLOR}>1001</Display>
      </div>
    </Wrapper>
  );
}
