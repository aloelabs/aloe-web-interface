import React from 'react';
import { PrimaryButton } from '../../common/Buttons';
import {
  CloseableModal,
  DashedDivider,
  HorizontalDivider,
  Label,
  Message,
  Value,
} from '../../common/Modal';
import TokenBreakdown from '../../common/TokenBreakdown';
import SuccessIcon from '../../../assets/svg/success.svg';

export type SharesWithdrawnModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  estimatedValue: string;
  token0Ticker: string;
  token1Ticker: string;
  token0Estimate: string;
  token1Estimate: string;
  numberOfShares: string;
};

export default function SharesWithdrawnModal(props: SharesWithdrawnModalProps) {
  const { open, setOpen, estimatedValue, token0Ticker, token1Ticker, token0Estimate, token1Estimate, numberOfShares } = props;
  return (
    <CloseableModal
      open={open}
      setOpen={setOpen}
      title='Shares Withdrawn'
    >
      <div className='flex justify-center items-center'>
        <img src={SuccessIcon} alt='success' />
      </div>
      <HorizontalDivider />
      <div className='flex flex-col gap-y-4 mb-4'>
        <Message>Withdraw Summary:</Message>
        <div className='flex justify-between items-center'>
          <Label>Pool Selected</Label>
          <DashedDivider />
          <Value>{token0Ticker} - {token1Ticker}</Value>
        </div>
        <div className='flex justify-between items-center'>
          <Label>Shares Withdrawn</Label>
          <DashedDivider />
          <Value>{numberOfShares} Shares</Value>
        </div>
        <div className='flex justify-between items-center'>
          <Label>Estimated Value</Label>
          <DashedDivider />
          <Value>{estimatedValue}</Value>
        </div>
      </div>
      <TokenBreakdown
        token0Ticker={token0Ticker}
        token1Ticker={token1Ticker}
        token0Estimate={token0Estimate}
        token1Estimate={token1Estimate}
      />
      <PrimaryButton className='w-full py-3 mt-8'>View Your Position</PrimaryButton>
    </CloseableModal>
  );
}
