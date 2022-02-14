import React, { useContext, useEffect, useMemo, useState } from 'react';
import TokenAmountInput from '../common/TokenAmountInput';
import { BlendPoolData } from '../../data/BlendPoolData';
import {
  BlendPoolDrawData,
  ResolveBlendPoolDrawData,
} from '../../data/BlendPoolDataResolver';
import { LinkButtonWithIcon, PrimaryButton } from '../common/Buttons';
import GearIconPurple from '../../assets/svg/gear_purple.svg';
import ToggleableRatioChange from './ToggleableRatioChange';
import { BlendPoolContext } from '../../data/context/BlendPoolContext';
import { useAccount, useBalance, useSigner } from 'wagmi';
import Big from 'big.js';
import { prettyFormatBalance, String1E, toBig } from '../../util/Numbers';
import {
  DEFAULT_RATIO_CHANGE,
  RATIO_CHANGE_CUTOFF,
} from '../../data/constants/Values';
import { withdraw } from '../../connector/BlendWithdrawActions';
import Pending from '../common/Pending';

export type WithdrawTabProps = {
  poolData: BlendPoolData;
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
      return 'Deposit';
    case ButtonState.RATIO_CHANGE_TOO_LOW:
      return 'Ratio Change Too Low';
    case ButtonState.INSUFFICIENT_SHARES:
      return 'Insufficient Shares';
    case ButtonState.READY:
      return 'Confirm Withdraw';
  }
}

export default function WithdrawTab(props: WithdrawTabProps) {
  const drawData = ResolveBlendPoolDrawData(props.poolData);
  const [sharesAmount, setSharesAmount] = useState('');

  const [advOptionsClosed, setAdvOptionsClosed] = useState<boolean>(true);
  const [ratioChange, setRatioChange] = useState(DEFAULT_RATIO_CHANGE);

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
        .toExponential(4);
    }

    if (estimated1Label.length > 9) {
      estimated1Label = estimated1
        .div(String1E(poolStats.token1Decimals))
        .toExponential(4);
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
    } else if (Number(ratioChange) <= RATIO_CHANGE_CUTOFF) {
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
    ratioChange,
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

          const shares = new Big(sharesAmount).mul(String1E(18));

          withdraw(
            signer,
            props.poolData.poolAddress,
            shares,
            Number(ratioChange),
            poolStats,
            (receipt) => {
              setIsTransactionPending(false);
              console.log(receipt);
            }
          );
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
    <div className='flex flex-col items-center justify-center pt-4'>
      <div className='w-full'>
        <TokenAmountInput
          onChange={(newValue) => setSharesAmount(newValue)}
          max={maxSharesString}
          value={sharesAmount}
          tokenLabel='Shares'
        />
        {/*<WithdrawPreview token0Label={drawData.token0Label} token1Label={drawData.token1Label} token0Amount={'123.456'} token1Amount={'123.456'} />*/}
        {/*<div className='w-full px-4 mt-2 mb-4 border-t-2 border-t-grey-200 h-0'/>*/}

        <div className='w-full text-sm text-grey-800 pt-2 pl-2'>
          The approximate return will be:
        </div>
        <div className='flex flex-row items-center justify-between w-full h-8 my-2 pl-2'>
          <div className='h-full flex flex-row items-center justify-center'>
            <div className='pr-4'>
              <span className='text-grey-600'>{token0Estimate}</span>
              &nbsp;
              <span className='text-grey-900 font-semibold'>
                {drawData.token0Label}
              </span>
            </div>
            <div className='h-6 w-0 border-r-2 border-r-grey-400' />
            <div className='pl-4'>
              <span className='text-grey-600'>{token1Estimate}</span>
              &nbsp;
              <span className='text-grey-900 font-semibold'>
                {drawData.token1Label}
              </span>
            </div>
          </div>
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
        <div className='w-full mt-3 overflow-hidden'>
          <ToggleableRatioChange
            closed={advOptionsClosed}
            value={ratioChange}
            onChange={(newValue) => {
              setRatioChange(newValue);
            }}
          >
            <div className='py-1'>
              Because of price movements, the ratio between the two assets might
              change as the withdrawal is confirmed.
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
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
