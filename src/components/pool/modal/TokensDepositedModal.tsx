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

export type TokensDepositedModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  totalEstimatedValue: string;
  token0Ticker: string;
  token1Ticker: string;
  token0Estimate: string;
  token1Estimate: string;
};

export default function TokensDepositedModal(props: TokensDepositedModalProps) {
  const { open, setOpen, totalEstimatedValue, token0Ticker, token1Ticker, token0Estimate, token1Estimate } = props;
  return (
    <CloseableModal
      open={open}
      setOpen={setOpen}
      title='Tokens Deposited'
    >
      <div className='flex justify-center items-center'>
        <img src={SuccessIcon} alt='success' />
      </div>
      <HorizontalDivider />
      <div className='flex flex-col gap-y-4 mb-4'>
        <Message>Deposit Summary:</Message>
        <div className='flex justify-between items-center'>
          <Label>Pool Selected</Label>
          <DashedDivider />
          <Value>{token0Ticker} - {token1Ticker}</Value>
        </div>
        <div className='flex justify-between items-center'>
          <Label>Total Estimated Value</Label>
          <DashedDivider />
          <Value>{totalEstimatedValue}</Value>
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
