import React from 'react';
import { PrimaryButton } from '../../common/Buttons';
import {
  CloseableModal,
  DashedDivider,
  HorizontalDivider,
  Label,
  Value,
} from '../../common/Modal';
import TokenBreakdown from '../../common/TokenBreakdown';

export type ConfirmWithdrawalModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  estimatedReturn: string;
  token0Ticker: string;
  token1Ticker: string;
  token0Estimate: string;
  token1Estimate: string;
  numberOfShares: string;
  maxSlippage: string;
  networkFee: string;
};

export default function ConfirmWithdrawalModal(props: ConfirmWithdrawalModalProps) {
  const { open, setOpen, onConfirm, onCancel, estimatedReturn, token0Ticker, token1Ticker, token0Estimate, token1Estimate, numberOfShares, maxSlippage, networkFee } = props;
  return (
    <CloseableModal
      open={open}
      setOpen={setOpen}
      onClose={onCancel}
      title='Confirm Withdrawal'
    >
      <div className='flex flex-col gap-y-4 mb-4'>
        <div className='flex justify-between items-center'>
          <Label>Shares</Label>
          <DashedDivider />
          <Value>{numberOfShares} Shares</Value>
        </div>
        <div className='flex justify-between items-center'>
          <Label>Estimated Return</Label>
          <DashedDivider />
          <Value>{estimatedReturn}</Value>
        </div>
      </div>
      <TokenBreakdown
        token0Ticker={token0Ticker}
        token1Ticker={token1Ticker}
        token0Estimate={token0Estimate}
        token1Estimate={token1Estimate}
      />
      <HorizontalDivider />
      <div className='flex flex-col gap-y-4'>
        <div className='flex justify-between items-center'>
          <Label>Pool Selected</Label>
          <DashedDivider />
          <Value>{token0Ticker} - {token1Ticker}</Value>
        </div>
        <div className='flex justify-between items-center'>
          <Label>Max Slippage</Label>
          <DashedDivider />
          <Value>{maxSlippage}%</Value>
        </div>
      </div>
      <HorizontalDivider />
      <div className='flex justify-between items-center mb-8'>
        <Label>Network Fees</Label>
        <DashedDivider />
        <Value>{networkFee} WETH</Value>
      </div>
      <PrimaryButton className='w-full py-3' onClick={onConfirm}>Confirm Withdrawal</PrimaryButton>
    </CloseableModal>
  );
}
