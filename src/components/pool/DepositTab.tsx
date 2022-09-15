import Big from 'big.js';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { useSigner } from 'wagmi';
import {
  approve,
  deposit,
  mintWeth,
} from '../../connector/BlendDepositActions';
import {
  BlendPoolDrawData,
  ResolveBlendPoolDrawData,
} from '../../data/BlendPoolDataResolver';
import { BlendPoolMarkers } from '../../data/BlendPoolMarkers';
import { WETH_9_MAINNET_ADDRESS } from '../../data/constants/Addresses';
import {
  DEFAULT_RATIO_CHANGE,
  RATIO_CHANGE_CUTOFF,
} from '../../data/constants/Values';
import { BlendPoolContext } from '../../data/context/BlendPoolContext';
import { useDeposit } from '../../data/hooks/UseDeposit';
import { formatUSDCompact, String1E } from '../../util/Numbers';
import { FilledStylizedButton } from '../common/Buttons';
import Pending from '../common/Pending';
import TokenAmountInput from '../common/TokenAmountInput';
import MaxSlippageInput from './MaxSlippageInput';
import ConfirmDepositModal from './modal/ConfirmDepositModal';
import SubmittingOrderModal from './modal/SubmittingOrderModal';
import TokensDepositedModal from './modal/TokensDepositedModal';
import TransactionFailedModal from './modal/TransactionFailedModal';
import { OffChainPoolStats } from '../../data/PoolStats';

export type DepositTabProps = {
  poolData: BlendPoolMarkers;
  offChainPoolStats: OffChainPoolStats | undefined;
};

enum ButtonState {
  NO_WALLET,
  INSUFFICIENT_TOKEN_0,
  INSUFFICIENT_TOKEN_1,
  MINT_WETH,
  APPROVE_0,
  APPROVE_1,
  RATIO_CHANGE_TOO_LOW,
  READY,
  PENDING_TRANSACTION,
}

function printButtonState(
  buttonState: ButtonState,
  drawData: BlendPoolDrawData
) {
  switch (buttonState) {
    case ButtonState.NO_WALLET:
      return 'Deposit';
    case ButtonState.RATIO_CHANGE_TOO_LOW:
      return 'Ratio Change Too Low';
    case ButtonState.INSUFFICIENT_TOKEN_0:
      return `Insufficient ${drawData.token0Label}`;
    case ButtonState.INSUFFICIENT_TOKEN_1:
      return `Insufficient ${drawData.token1Label}`;
    case ButtonState.MINT_WETH:
      return 'Mint WETH';
    case ButtonState.APPROVE_0:
      return `Approve ${drawData.token0Label}`;
    case ButtonState.APPROVE_1:
      return `Approve ${drawData.token1Label}`;
    case ButtonState.READY:
      return 'Confirm Deposit';
  }
}

export const TabWrapper = styled.div`
  ${tw`flex flex-col items-center justify-center`}
  padding: 24px;
`;

const TOOLTIP_CONTENT_DEPOSIT =
  'Deposit amounts are based on current prices. If prices shift while your transaction is pending, some funds may be returned to you instead of being deposited to Blend. Slippage is the threshold between returning funds and canceling the transaction altogether (to save gas).';

export default function DepositTab(props: DepositTabProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [showSubmittingModal, setShowSubmittingModal] = useState(false);
  const drawData = ResolveBlendPoolDrawData(props.poolData);

  const { poolStats } = useContext(BlendPoolContext);
  const depositData = useDeposit(props.poolData);
  const { data: signer } = useSigner();

  const [token0Amount, setToken0Amount] = useState('');
  const [token1Amount, setToken1Amount] = useState('');

  const { offChainPoolStats } = props;
  const [usdEstimate, setUsdEstimate] = useState('-');
  const [sharesEstimate, setSharesEstimate] = useState('-');

  const [maxSlippage, setMaxSlippage] = useState(DEFAULT_RATIO_CHANGE);

  const [buttonState, setButtonState] = useState<ButtonState>(
    ButtonState.NO_WALLET
  );

  const [isTransactionPending, setIsTransactionPending] =
    useState<boolean>(false);

  // Cancel out weird on-chain decimal stuff
  const maxToken0String = depositData
    ? depositData.maxToken0
        .div(String1E(depositData.token0Decimals))
        .toFixed(depositData.token0Decimals)
    : undefined;
  const maxToken1String = depositData
    ? depositData.maxToken1
        ?.div(String1E(depositData.token1Decimals))
        .toFixed(depositData.token1Decimals)
    : undefined;

  // Determine button state
  useEffect(() => {
    let mounted = true;

    const token0IsWETH =
      props.poolData.token0Address === WETH_9_MAINNET_ADDRESS;
    const token1IsWETH =
      props.poolData.token1Address === WETH_9_MAINNET_ADDRESS;

    // Input fields as Big
    const amount0 =
      token0Amount === '' || !depositData
        ? new Big(0)
        : new Big(token0Amount).mul(String1E(depositData.token0Decimals));
    const amount1 =
      token1Amount === '' || !depositData
        ? new Big(0)
        : new Big(token1Amount).mul(String1E(depositData.token1Decimals));

    if (offChainPoolStats && poolStats && depositData) {
      // Compute shares estimate
      // Assumes amount0/1 have beeen balanced to current pool ratio
      const depositProportionToPool = amount0.div(poolStats.inventory0.total);

      // Compute USD estimate
      if (mounted) {
        setSharesEstimate(
          depositProportionToPool
            .mul(poolStats.outstandingShares)
            .div(String1E(18))
            .toExponential(2)
        );
        setUsdEstimate(
          formatUSDCompact(
            depositProportionToPool
              .mul(offChainPoolStats.total_value_locked)
              .toNumber()
          )
        );
      }
    } else {
      if (mounted) {
        setUsdEstimate('-');
        setSharesEstimate('-');
      }
    }

    if (!mounted) {
      return;
    }
    if (isTransactionPending) {
      setButtonState(ButtonState.PENDING_TRANSACTION);
    } else if (!depositData || amount0.eq(0) || amount1.eq(0)) {
      setButtonState(ButtonState.NO_WALLET);
    } else if (Number(maxSlippage) <= RATIO_CHANGE_CUTOFF) {
      setButtonState(ButtonState.RATIO_CHANGE_TOO_LOW);
    } else if (amount0.gt(depositData.maxToken0)) {
      setButtonState(ButtonState.INSUFFICIENT_TOKEN_0);
    } else if (amount1.gt(depositData.maxToken1)) {
      setButtonState(ButtonState.INSUFFICIENT_TOKEN_1);
    } else if (
      (token0IsWETH && amount0.gt(depositData.token0Balance)) ||
      (token1IsWETH && amount1.gt(depositData.token1Balance))
    ) {
      // should mint amount entered - weth balance
      setButtonState(ButtonState.MINT_WETH);
    } else if (amount0.gt(depositData.token0Allowance)) {
      // TODO seems like this gets called many times even if user isn't interacting with anything
      setButtonState(ButtonState.APPROVE_0);
    } else if (amount1.gt(depositData.token1Allowance)) {
      // TODO seems like this gets called many times even if user isn't interacting with anything
      setButtonState(ButtonState.APPROVE_1);
    } else {
      setButtonState(ButtonState.READY);
    }

    return () => {
      mounted = false;
    };
  }, [
    depositData,
    isTransactionPending,
    props.poolData.token0Address,
    props.poolData.token1Address,
    maxSlippage,
    token0Amount,
    token1Amount,
    signer,
    offChainPoolStats,
    poolStats,
  ]);

  const buttonLabel = printButtonState(buttonState, drawData);

  // Resolve button action

  const constructButtonAction: (buttonState: ButtonState) => () => void = (
    buttonState
  ) => {
    if (!signer) return () => {};

    switch (buttonState) {
      case ButtonState.MINT_WETH:
        return () => {
          if (!depositData) {
            console.log(
              'No deposit data in mint call, something bad happened...'
            );
            return;
          }
          setIsTransactionPending(true);
          // should mint amount entered - weth balance

          const token0IsWeth =
            props.poolData.token0Address === WETH_9_MAINNET_ADDRESS;
          const wethDesired = new Big(
            token0IsWeth ? token0Amount : token1Amount
          ).mul(String1E(18));
          const wethToMint = wethDesired.minus(
            token0IsWeth ? depositData.token0Balance : depositData.token1Balance
          );

          // logBig(wethDesired);
          // logBig(wethToMint);
          // logBig(wethToMint.div(String1E(18)));

          mintWeth(signer, wethToMint, (receipt) => {
            setIsTransactionPending(false);
            console.log(receipt);
          });
        };
      case ButtonState.APPROVE_0:
        return () => {
          setIsTransactionPending(true);
          // Approve max
          approve(
            signer,
            props.poolData.token0Address,
            props.poolData.poolAddress,
            (receipt) => {
              setIsTransactionPending(false);
              console.log(receipt);
            }
          );
        };
      case ButtonState.APPROVE_1:
        return () => {
          setIsTransactionPending(true);
          // Approve max
          approve(
            signer,
            props.poolData.token1Address,
            props.poolData.poolAddress,
            (receipt) => {
              setIsTransactionPending(false);
              console.log(receipt);
            }
          );
        };
      case ButtonState.READY:
        return () => {
          if (!depositData) {
            console.log(
              'No deposit data in deposit handler, something bad happened...'
            );
            return;
          }
          setIsTransactionPending(true);
          setShowConfirmModal(true);
        };
      case ButtonState.NO_WALLET:
      case ButtonState.RATIO_CHANGE_TOO_LOW:
      case ButtonState.INSUFFICIENT_TOKEN_0:
      case ButtonState.INSUFFICIENT_TOKEN_1:
      default:
        return () => {};
    }
  };

  const onButtonClick: () => void = constructButtonAction(buttonState);
  return (
    <TabWrapper>
      <div className='w-full flex flex-col gap-y-4'>
        <TokenAmountInput
          value={token0Amount}
          tokenLabel={drawData.token0Label}
          max={maxToken0String}
          maxed={token0Amount === maxToken0String}
          onChange={(newValue) => {
            if (newValue === '') {
              setToken1Amount('');
            } else if (poolStats && poolStats.inventory0.total.gt(0)) {
              const amount0 = new Big(newValue);
              const mantissa0 = String1E(poolStats.token0Decimals);
              const mantissa1 = String1E(poolStats.token1Decimals);

              setToken1Amount(
                amount0
                  .mul(mantissa0)
                  .mul(poolStats.inventory1.total)
                  .div(poolStats.inventory0.total)
                  .div(mantissa1)
                  .toFixed(poolStats.token1Decimals)
              );
            } else if (poolStats) {
              // If inventory0 is 0
              const amount0 = new Big(newValue);
              const mantissa0 = String1E(poolStats.token0Decimals);
              const mantissa1 = String1E(poolStats.token1Decimals);

              setToken1Amount(
                amount0
                  .mul(mantissa0)
                  .mul(poolStats.token1OverToken0)
                  .div(mantissa1)
                  .toFixed(poolStats.token1Decimals)
              );
            }
            setToken0Amount(newValue);
          }}
          error={false}
          errorMessage='Error message'
        />
        <TokenAmountInput
          value={token1Amount}
          tokenLabel={drawData.token1Label}
          max={maxToken1String}
          maxed={token1Amount === maxToken1String}
          onChange={(newValue) => {
            if (newValue === '') {
              setToken0Amount('');
            } else if (poolStats && poolStats.inventory1.total.gt(0)) {
              const amount1 = new Big(newValue);
              const mantissa0 = String1E(poolStats.token0Decimals);
              const mantissa1 = String1E(poolStats.token1Decimals);

              setToken0Amount(
                amount1
                  .mul(mantissa1)
                  .mul(poolStats.inventory0.total)
                  .div(poolStats.inventory1.total)
                  .div(mantissa0)
                  .toFixed(poolStats.token0Decimals)
              );
            } else if (poolStats) {
              // If inventory1 is 0
              const amount1 = new Big(newValue);
              const mantissa0 = String1E(poolStats.token0Decimals);
              const mantissa1 = String1E(poolStats.token1Decimals);
              setToken0Amount(
                amount1
                  .mul(mantissa1)
                  .div(poolStats.token1OverToken0)
                  .div(mantissa0)
                  .toFixed(poolStats.token0Decimals)
              );
            }

            setToken1Amount(newValue);
          }}
          error={false}
          errorMessage='Error message'
        />
      </div>
      <MaxSlippageInput
        tooltipContent={TOOLTIP_CONTENT_DEPOSIT}
        updateMaxSlippage={(updatedMaxSlippage) =>
          setMaxSlippage(updatedMaxSlippage)
        }
      />
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
            ButtonState.INSUFFICIENT_TOKEN_0,
            ButtonState.INSUFFICIENT_TOKEN_1,
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
      <ConfirmDepositModal
        open={showConfirmModal}
        setOpen={setShowConfirmModal}
        onConfirm={() => {
          setShowConfirmModal(false);
          setShowSubmittingModal(true);
          if (!signer || !depositData) {
            setIsTransactionPending(false);
            return;
          }
          const amount0Max = new Big(token0Amount).mul(
            String1E(depositData.token0Decimals)
          );
          const amount1Max = new Big(token1Amount).mul(
            String1E(depositData.token1Decimals)
          );
          deposit(
            signer,
            props.poolData.poolAddress,
            amount0Max,
            amount1Max,
            Number(maxSlippage),
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
        estimatedTotal={usdEstimate}
        token0Ticker={drawData.token0Label}
        token1Ticker={drawData.token1Label}
        token0Estimate={token0Amount}
        token1Estimate={token1Amount}
        numberOfShares={sharesEstimate}
        maxSlippage={maxSlippage}
        networkFee='TODO'
      />
      <TokensDepositedModal
        open={showSuccessModal}
        setOpen={setShowSuccessModal}
        totalEstimatedValue={usdEstimate}
        token0Ticker={drawData.token0Label}
        token1Ticker={drawData.token1Label}
        token0Estimate={token0Amount}
        token1Estimate={token1Amount}
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
