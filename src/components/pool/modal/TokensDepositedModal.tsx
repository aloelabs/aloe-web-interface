import React from 'react';
import SuccessIcon from '../../../assets/svg/success.svg';
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
import { Text } from '../../common/Typography';
import { MODAL_BLACK_TEXT_COLOR } from '../PoolInteractionTabs';

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
  const {
    open,
    setOpen,
    totalEstimatedValue,
    token0Ticker,
    token1Ticker,
    token0Estimate,
    token1Estimate,
  } = props;
  return (
    <CloseableModal open={open} setOpen={setOpen} title='Tokens Deposited'>
      <div className='flex justify-center items-center'>
        <img src={SuccessIcon} alt='success' />
      </div>
      <HorizontalDivider />
      <div className='flex flex-col gap-y-4 mb-4'>
        <Text size='M' weight='medium' color={MESSAGE_TEXT_COLOR}>Deposit Summary:</Text>
        <div className='flex justify-between items-center'>
          <Text size='S' weight='medium' color={LABEL_TEXT_COLOR}>
            Pool Selected
          </Text>
          <DashedDivider />
          <Text size='L' weight='medium' color={VALUE_TEXT_COLOR}>
            {token0Ticker} - {token1Ticker}
          </Text>
        </div>
        <div className='flex justify-between items-center'>
          <Text size='S' weight='medium' color={LABEL_TEXT_COLOR}>
            Total Estimated Value
          </Text>
          <DashedDivider />
          <Text size='L' weight='medium' color={VALUE_TEXT_COLOR}>
            {totalEstimatedValue}
          </Text>
        </div>
      </div>
      <TokenBreakdown
        token0Ticker={token0Ticker}
        token1Ticker={token1Ticker}
        token0Estimate={token0Estimate}
        token1Estimate={token1Estimate}
      />
      <FilledStylizedButton size='M' fillWidth={true} color={MODAL_BLACK_TEXT_COLOR} className='mt-8'>
        View Your Position
      </FilledStylizedButton>
    </CloseableModal>
  );
}
