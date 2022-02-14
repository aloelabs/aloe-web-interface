import React, { useContext, useEffect, useState } from 'react';
import { BlendPoolData } from '../../data/BlendPoolData';
import {
  BlendPoolDrawData,
  logBig,
  ResolveBlendPoolDrawData,
} from '../../data/BlendPoolDataResolver';
import TokenAmountInput from '../common/TokenAmountInput';
import { LinkButtonWithIcon, PrimaryButton } from '../common/Buttons';
import GearIconPurple from '../../assets/svg/gear_purple.svg';
import ToggleableRatioChange from './ToggleableRatioChange';
import RiskNotices from '../common/RiskNotices';
import { String1E } from '../../util/Numbers';
import { WETH_9_MAINNET_ADDRESS } from '../../data/constants/Addresses';
import Big from 'big.js';
import { useDeposit } from '../../data/hooks/UseDeposit';
import { BlendPoolContext } from '../../data/context/BlendPoolContext';
import {
  approve,
  deposit,
  mintWeth,
} from '../../connector/BlendDepositActions';
import Pending from '../common/Pending';
import { useSigner } from 'wagmi';
import {
  DEFAULT_RATIO_CHANGE,
  RATIO_CHANGE_CUTOFF,
} from '../../data/constants/Values';

export type DepositTabProps = {
  poolData: BlendPoolData;
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

export default function DepositTab(props: DepositTabProps) {
  const drawData = ResolveBlendPoolDrawData(props.poolData);

  const { poolStats } = useContext(BlendPoolContext);
  const depositData = useDeposit(props.poolData);
  const [{ data: signer }] = useSigner();

  const [token0Amount, setToken0Amount] = useState('');
  const [token1Amount, setToken1Amount] = useState('');

  const [advOptionsClosed, setAdvOptionsClosed] = useState<boolean>(true);
  const [ratioChange, setRatioChange] = useState(DEFAULT_RATIO_CHANGE);

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

    if (isTransactionPending) {
      setButtonState(ButtonState.PENDING_TRANSACTION);
    } else if (!depositData || amount0.eq(0) || amount1.eq(0)) {
      setButtonState(ButtonState.NO_WALLET);
    } else if (Number(ratioChange) <= RATIO_CHANGE_CUTOFF) {
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
  }, [
    depositData,
    isTransactionPending,
    props.poolData.token0Address,
    props.poolData.token1Address,
    ratioChange,
    token0Amount,
    token1Amount,
    signer,
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

          logBig(wethDesired);
          logBig(wethToMint);
          logBig(wethToMint.div(String1E(18)));

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
            Number(ratioChange),
            (receipt) => {
              setIsTransactionPending(false);
              console.log(receipt);
            }
          );
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
    <div className='flex flex-col items-center justify-center pt-4'>
      <div className='w-full'>
        <TokenAmountInput
          value={token0Amount}
          tokenLabel={drawData.token0Label}
          max={maxToken0String}
          onChange={(newValue) => {
            if (newValue === '') {
              setToken1Amount('');
            } else if (poolStats) {
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
            }
            setToken0Amount(newValue);
          }}
        />
        <TokenAmountInput
          value={token1Amount}
          tokenLabel={drawData.token1Label}
          max={maxToken1String}
          onChange={(newValue) => {
            if (newValue === '') {
              setToken0Amount('');
            } else if (poolStats) {
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
            }

            setToken1Amount(newValue);
          }}
        />
      </div>
      {/*<div className='w-full px-4 mt-2 mb-4 border-t-2 border-t-grey-100 h-0'/>*/}
      <div className='flex flex-row items-center justify-between w-full h-8 my-2'>
        <RiskNotices />
        <LinkButtonWithIcon
          icon={GearIconPurple}
          className='flex flex-row items-center justify-center'
          name='Advanced'
          onClick={() => {
            setAdvOptionsClosed(!advOptionsClosed);
          }}
        >
          <div className=''>Advanced</div>
        </LinkButtonWithIcon>
      </div>
      <div className='w-full overflow-hidden mt-2'>
        <ToggleableRatioChange
          closed={advOptionsClosed}
          value={ratioChange}
          onChange={(newValue) => {
            setRatioChange(newValue);
          }}
        >
          <div className='py-1'>
            Because of price movements, the ratio between the two assets might
            change as the deposit is confirmed.
          </div>
          <div className='py-1'>
            Transaction reverts if the total change is greater than this limit
            for either token.
          </div>
        </ToggleableRatioChange>
      </div>
      <div className='w-full'>
        <PrimaryButton
          className='w-full py-2 mt-2'
          name={buttonLabel}
          onClick={onButtonClick}
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
        </PrimaryButton>
      </div>
    </div>
  );
}
