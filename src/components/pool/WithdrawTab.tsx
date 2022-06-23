import Big from 'big.js';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { useAccount, useBalance, useSigner } from 'wagmi';
import { withdraw } from '../../connector/BlendWithdrawActions';
import {
  BlendPoolDrawData,
  ResolveBlendPoolDrawData
} from '../../data/BlendPoolDataResolver';
import { BlendPoolMarkers } from '../../data/BlendPoolMarkers';
import {
  DEFAULT_RATIO_CHANGE,
  RATIO_CHANGE_CUTOFF
} from '../../data/constants/Values';
import { BlendPoolContext } from '../../data/context/BlendPoolContext';
import { GetTokenData } from '../../data/TokenData';
import { prettyFormatBalance, String1E, toBig } from '../../util/Numbers';
import { FilledStylizedButton } from '../common/Buttons';
import Pending from '../common/Pending';
import TokenAmountInput from '../common/TokenAmountInput';
import { SectionLabel, TabWrapper } from './DepositTab';
import MaxSlippageInput from './MaxSlippageInput';
import ConfirmWithdrawalModal from './modal/ConfirmWithdrawalModal';
import SharesWithdrawnModal from './modal/SharesWithdrawnModal';
import SubmittingOrderModal from './modal/SubmittingOrderModal';
import TransactionFailedModal from './modal/TransactionFailedModal';

export type WithdrawTabProps = {
  poolData: BlendPoolMarkers;
};

enum ButtonState {
  NO_WALLET,
  RATIO_CHANGE_TOO_LOW,
  INSUFFICIENT_SHARES,
  READY,
  PENDING_TRANSACTION,
}

function printButtonState(
  buttonState: ButtonState,
  drawData: BlendPoolDrawData
) {
  switch (buttonState) {
    case ButtonState.NO_WALLET:
      return 'Withdraw';
    case ButtonState.RATIO_CHANGE_TOO_LOW:
      return 'Ratio Change Too Low';
    case ButtonState.INSUFFICIENT_SHARES:
      return 'Insufficient Shares';
    case ButtonState.READY:
      return 'Confirm Withdraw';
  }
}

const HorizontalDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: rgba(26, 41, 52, 1);
`;

const EstimatedReturnValue = styled.div`
  /* font-family: 'ClashDisplay-Variable'; */
  font-size: 32px;
  font-weight: 600;
  line-height: 40px;
`;

const TokenBreakdown = styled.div`
  ${tw`w-full flex flex-row items-center justify-between`}
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
  line-height: 24px;
  color: rgba(255, 255, 255, 1);
`;

export default function WithdrawTab(props: WithdrawTabProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [showSubmittingModal, setShowSubmittingModal] = useState(false);
  const drawData = ResolveBlendPoolDrawData(props.poolData);
  const [sharesAmount, setSharesAmount] = useState('');

  const [maxSlippage, setMaxSlippage] = useState(DEFAULT_RATIO_CHANGE);

  const [token0Estimate, setToken0Estimate] = useState('-');
  const [token1Estimate, setToken1Estimate] = useState('-');

  const { poolStats } = useContext(BlendPoolContext);
  const [{ data: accountData }] = useAccount();
  const [{ data: shareBalanceData }] = useBalance({
    addressOrName: accountData?.address,
    token: props.poolData.poolAddress,
    watch: true,
  });
  const [{ data: signer }] = useSigner();

  const [buttonState, setButtonState] = useState<ButtonState>(
    ButtonState.NO_WALLET
  );
  const [isTransactionPending, setIsTransactionPending] =
    useState<boolean>(false);

  const sharesBig = useMemo(() => {
    return sharesAmount === ''
      ? new Big(0)
      : new Big(sharesAmount).mul(String1E(18));
  }, [sharesAmount]);

  const maxShares: Big | undefined = shareBalanceData
    ? toBig(shareBalanceData.value)
    : undefined;

  const maxSharesString = maxShares
    ? maxShares.div(String1E(18)).toFixed(18)
    : undefined;

  // Print estimated returns
  useEffect(() => {
    if (sharesBig.eq(0) || !poolStats || poolStats.outstandingShares.eq(0)) {
      setToken0Estimate('-');
      setToken1Estimate('-');
      return;
    }
    const estimated0 = poolStats.inventory0.total
      .mul(sharesBig)
      .div(poolStats.outstandingShares);
    const estimated1 = poolStats.inventory1.total
      .mul(sharesBig)
      .div(poolStats.outstandingShares);

    let estimated0Label = prettyFormatBalance(
      estimated0,
      poolStats.token0Decimals
    );
    let estimated1Label = prettyFormatBalance(
      estimated1,
      poolStats.token1Decimals
    );

    if (estimated0Label.length > 9) {
      estimated0Label = estimated0
        .div(String1E(poolStats.token0Decimals))
        .toExponential(2);
    }

    if (estimated1Label.length > 9) {
      estimated1Label = estimated1
        .div(String1E(poolStats.token1Decimals))
        .toExponential(2);
    }

    setToken0Estimate(estimated0Label);
    setToken1Estimate(estimated1Label);
  }, [poolStats, sharesBig]);

  // Determine button state
  useEffect(() => {
    if (isTransactionPending) {
      setButtonState(ButtonState.PENDING_TRANSACTION);
    } else if (!maxShares || !poolStats || sharesBig.eq(0)) {
      setButtonState(ButtonState.NO_WALLET);
    } else if (Number(maxSlippage) <= RATIO_CHANGE_CUTOFF) {
      setButtonState(ButtonState.RATIO_CHANGE_TOO_LOW);
    } else if (sharesBig.gt(maxShares)) {
      setButtonState(ButtonState.INSUFFICIENT_SHARES);
    } else {
      setButtonState(ButtonState.READY);
    }
  }, [
    isTransactionPending,
    maxShares,
    poolStats,
    maxSlippage,
    sharesAmount,
    sharesBig,
  ]);

  const buttonLabel = printButtonState(buttonState, drawData);

  const constructButtonAction: (buttonState: ButtonState) => () => void = (
    buttonState
  ) => {
    if (!signer) return () => {};

    switch (buttonState) {
      case ButtonState.READY:
        return () => {
          if (!poolStats) {
            console.log(
              'No pool stats in withdraw handler, something bad happened...'
            );
            return;
          }
          setIsTransactionPending(true);
          setShowConfirmModal(true);
        };
      case ButtonState.NO_WALLET:
      case ButtonState.RATIO_CHANGE_TOO_LOW:
      case ButtonState.INSUFFICIENT_SHARES:
      default:
        return () => {};
    }
  };

  const onButtonClick: () => void = constructButtonAction(buttonState);

  return (
    <TabWrapper>
      <div className='w-full flex flex-col items-center justify-center'>
        <div className='w-full flex flex-col gap-y-6'>
          <TokenAmountInput
            onChange={(newValue) => setSharesAmount(newValue)}
            max={maxSharesString}
            value={sharesAmount}
            tokenLabel='Shares'
          />
          <HorizontalDivider />
          <div className='w-full flex flex-col gap-y-6'>
            <div className='w-full flex flex-col gap-y-3'>
              <SectionLabel>Your estimated return</SectionLabel>
              <EstimatedReturnValue>
                {prettyFormatBalance()}
              </EstimatedReturnValue>
            </div>
            <div className='w-full flex flex-col gap-y-3'>
              <SectionLabel>Token Breakdown</SectionLabel>
              <div className='flex gap-x-2'>
                <TokenBreakdown>
                  <TokenBreakdownLabel>
                    {
                      GetTokenData(
                        props.poolData.token0Address.toLocaleLowerCase()
                      ).ticker
                    }
                  </TokenBreakdownLabel>
                  <TokenBreakdownValue>
                    {token0Estimate}
                  </TokenBreakdownValue>
                </TokenBreakdown>
                <TokenBreakdown>
                  <TokenBreakdownLabel>
                    {
                      GetTokenData(
                        props.poolData.token1Address.toLocaleLowerCase()
                      ).ticker
                    }
                  </TokenBreakdownLabel>
                  <TokenBreakdownValue>
                    {token1Estimate}
                  </TokenBreakdownValue>
                </TokenBreakdown>
              </div>
            </div>
          </div>
        </div>
        <MaxSlippageInput updateMaxSlippage={(updatedMaxSlippage) => setMaxSlippage(updatedMaxSlippage)} />
        <div className='w-full mt-8'>
          <FilledStylizedButton
            className='w-full py-2'
            name={buttonLabel}
            size='M'
            onClick={onButtonClick}
            backgroundColor={'rgba(26, 41, 52, 1)'}
            color={'rgba(255, 255, 255, 1)'}
            fillWidth={true}
            disabled={[
              ButtonState.INSUFFICIENT_SHARES,
              ButtonState.PENDING_TRANSACTION,
              ButtonState.RATIO_CHANGE_TOO_LOW,
            ].includes(buttonState)}
          >
            <div className='flex flex-row items-center justify-center'>
              {buttonState === ButtonState.PENDING_TRANSACTION ? (
                <Pending />
              ) : (
                <span>{buttonLabel}</span>
              )}
            </div>
          </FilledStylizedButton>
        </div>
      </div>
      <ConfirmWithdrawalModal
        open={showConfirmModal}
        setOpen={setShowConfirmModal}
        onConfirm={() => {
          setShowConfirmModal(false);
          setShowSubmittingModal(true);
          if (!signer || !poolStats) {
            setIsTransactionPending(false);
            return;
          }
          const shares = new Big(sharesAmount).mul(String1E(18));
          withdraw(
            signer,
            props.poolData.poolAddress,
            shares,
            Number(maxSlippage),
            poolStats,
            (receipt) => {
              setShowSubmittingModal(false);
              if (receipt?.status === 1) {
                setShowSuccessModal(true);
              } else {
                setShowFailedModal(true);
              }
              setIsTransactionPending(false);
              console.log(receipt);
            }
          );
        }}
        onCancel={() => {
          setIsTransactionPending(false);
        }}
        estimatedReturn='$204.94'
        token0Ticker={drawData.token0Label}
        token1Ticker={drawData.token1Label}
        token0Estimate={token0Estimate}
        token1Estimate={token1Estimate}
        numberOfShares={sharesAmount}
        maxSlippage={maxSlippage}
        networkFee='0.01'
      />
      <SharesWithdrawnModal
        open={showSuccessModal}
        setOpen={setShowSuccessModal}
        estimatedValue='$204.94'
        token0Ticker={drawData.token0Label}
        token1Ticker={drawData.token1Label}
        token0Estimate={token0Estimate}
        token1Estimate={token1Estimate}
        numberOfShares={sharesAmount}
      />
      <TransactionFailedModal
        open={showFailedModal}
        setOpen={setShowFailedModal}
      />
      <SubmittingOrderModal
        open={showSubmittingModal}
        setOpen={setShowSubmittingModal}
      />
    </TabWrapper>
  );
}
