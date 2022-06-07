import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { Text } from './Typography';

const LABEL_TEXT_COLOR = 'rgba(75, 105, 128, 1)';
const VALUE_TEXT_COLOR = 'rgba(255, 255, 255, 1)';

const TokenBreakdownWrapper = styled.div`
  ${tw`w-full flex flex-row items-center justify-between gap-x-3`}
  padding: 16px;
  border: 1px solid rgba(26, 41, 52, 1);
  border-radius: 8px;
`;

export type TokenBreakdownProps = {
  token0Ticker: string;
  token1Ticker: string;
  token0Estimate: string;
  token1Estimate: string;
};

export default function TokenBreakdown(props: TokenBreakdownProps) {
  const { token0Ticker, token1Ticker, token0Estimate, token1Estimate } = props;
  return (
    <div className='w-full grid grid-cols-2 gap-x-2'>
      <TokenBreakdownWrapper>
        <Text size='XS' weight='medium' color={LABEL_TEXT_COLOR}>
          {token0Ticker}
        </Text>
        <Text
          size='M'
          weight='medium'
          color={VALUE_TEXT_COLOR}
          title={token0Estimate}
          className='overflow-hidden text-ellipsis whitespace-nowrap'
        >
          {token0Estimate}
        </Text>
      </TokenBreakdownWrapper>
      <TokenBreakdownWrapper>
        <Text size='XS' weight='medium' color={LABEL_TEXT_COLOR}>
          {token1Ticker}
        </Text>
        <Text
          size='M'
          weight='medium'
          color={VALUE_TEXT_COLOR}
          title={token1Estimate}
          className='overflow-hidden text-ellipsis whitespace-nowrap'
        >
          {token1Estimate}
        </Text>
      </TokenBreakdownWrapper>
    </div>
  );
}
