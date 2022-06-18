import React from 'react';
import { FilledStylizedButton } from '../../common/Buttons';
import {
  CloseableModal,
  DashedDivider,
  HorizontalDivider,
  LABEL_TEXT_COLOR,
  MESSAGE_TEXT_COLOR,
  VALUE_TEXT_COLOR,
} from '../../common/Modal';
import TokenBreakdown from '../../common/TokenBreakdown';
import SuccessIcon from '../../../assets/svg/success.svg';
import { Text } from '../../common/Typography';
import { MODAL_BLACK_TEXT_COLOR } from '../PoolInteractionTabs';

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
        <Text size='M' weight='medium' color={MESSAGE_TEXT_COLOR}>Withdraw Summary:</Text>
        <div className='flex justify-between items-center'>
          <Text size='S' weight='medium' color={LABEL_TEXT_COLOR}>Pool Selected</Text>
          <DashedDivider />
          <Text size='L' weight='medium' color={VALUE_TEXT_COLOR}>{token0Ticker} - {token1Ticker}</Text>
        </div>
        <div className='flex justify-between items-center'>
          <Text size='S' weight='medium' color={LABEL_TEXT_COLOR}>Shares Withdrawn</Text>
          <DashedDivider />
          <Text size='L' weight='medium' color={VALUE_TEXT_COLOR}>{numberOfShares} Shares</Text>
        </div>
        <div className='flex justify-between items-center'>
          <Text size='S' weight='medium' color={LABEL_TEXT_COLOR}>Estimated Value</Text>
          <DashedDivider />
          <Text size='L' weight='medium' color={VALUE_TEXT_COLOR}>{estimatedValue}</Text>
        </div>
      </div>
      <TokenBreakdown
        token0Ticker={token0Ticker}
        token1Ticker={token1Ticker}
        token0Estimate={token0Estimate}
        token1Estimate={token1Estimate}
      />
      <FilledStylizedButton size='M' fillWidth={true} color={MODAL_BLACK_TEXT_COLOR} className='mt-8'>View Your Position</FilledStylizedButton>
    </CloseableModal>
  );
}
