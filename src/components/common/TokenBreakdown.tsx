import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';

const TokenBreakdownWrapper = styled.div`
  ${tw`w-full flex flex-row items-center justify-between gap-x-3`}
  padding: 16px;
  border: 1px solid rgba(26, 41, 52, 1);
  border-radius: 8px;
`;

const TokenBreakdownLabel = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: rgba(75, 105, 128, 1);
`;

const TokenBreakdownValue = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(255, 255, 255, 1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
        <TokenBreakdownLabel>{token0Ticker}</TokenBreakdownLabel>
        <TokenBreakdownValue title={token0Estimate}>{token0Estimate}</TokenBreakdownValue>
      </TokenBreakdownWrapper>
      <TokenBreakdownWrapper>
        <TokenBreakdownLabel>{token1Ticker}</TokenBreakdownLabel>
        <TokenBreakdownValue title={token1Estimate}>{token1Estimate}</TokenBreakdownValue>
      </TokenBreakdownWrapper>
    </div>
  );
}
