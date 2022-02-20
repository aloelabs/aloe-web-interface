import { BlendPoolMarkers } from '../BlendPoolMarkers';
import { useAccount, useBalance } from 'wagmi';
import { useAllowance } from './UseAllowance';
import Big from 'big.js';
import { useEffect, useState } from 'react';
import { toBig } from '../../util/Numbers';
import { WETH_9_MAINNET_ADDRESS } from '../constants/Addresses';
import { WETH_GAS_RESERVE } from '../constants/Values';

type DepositPageState = {
  token0Balance: Big;
  token1Balance: Big;
  maxToken0: Big;
  maxToken1: Big;
  token0Allowance: Big;
  token1Allowance: Big;
  token0Decimals: number;
  token1Decimals: number;
};

function tokenMaxFromBalance(
  balanceToken: Big,
  balanceETH: Big,
  address: string
) {
  if (address !== WETH_9_MAINNET_ADDRESS || balanceETH.lt(WETH_GAS_RESERVE)) {
    return balanceToken;
  }
  return balanceToken.plus(balanceETH).minus(WETH_GAS_RESERVE);
}

export function useDeposit(poolData: BlendPoolMarkers) {
  const [state, setState] = useState<DepositPageState | null>(null);

  const [{ data: accountData }] = useAccount();
  const [{ data: token0BalanceData }] = useBalance({
    addressOrName: accountData?.address,
    token: poolData.token0Address,
    watch: true,
  });
  const [{ data: token1BalanceData }] = useBalance({
    addressOrName: accountData?.address,
    token: poolData.token1Address,
    watch: true,
  });
  const [{ data: ethBalanceData }] = useBalance({
    addressOrName: accountData?.address,
    watch: true,
  });
  const [{ data: token0Allowance }] = useAllowance({
    holderAddressOrName: accountData?.address,
    spenderAddressOrName: poolData.poolAddress,
    token: poolData.token0Address,
    watch: true,
  });
  const [{ data: token1Allowance }] = useAllowance({
    holderAddressOrName: accountData?.address,
    spenderAddressOrName: poolData.poolAddress,
    token: poolData.token1Address,
    watch: true,
  });

  useEffect(() => {
    if (
      token0BalanceData &&
      token1BalanceData &&
      ethBalanceData &&
      token0Allowance &&
      token1Allowance
    ) {
      const token0BalanceBig = toBig(token0BalanceData.value);
      const token1BalanceBig = toBig(token1BalanceData.value);
      const ethBalanceBig = toBig(ethBalanceData.value);

      setState({
        token0Balance: token0BalanceBig,
        token1Balance: token1BalanceBig,
        maxToken0: tokenMaxFromBalance(
          token0BalanceBig,
          ethBalanceBig,
          poolData.token0Address
        ),
        maxToken1: tokenMaxFromBalance(
          token1BalanceBig,
          ethBalanceBig,
          poolData.token1Address
        ),
        token0Allowance: token0Allowance,
        token1Allowance: token1Allowance,
        token0Decimals: token0BalanceData.decimals,
        token1Decimals: token1BalanceData.decimals,
      });
    } else {
      setState(null);
    }
  }, [
    token0BalanceData,
    token1BalanceData,
    ethBalanceData,
    token0Allowance,
    token1Allowance,
    poolData.token0Address,
    poolData.token1Address,
  ]);

  return state;
}
