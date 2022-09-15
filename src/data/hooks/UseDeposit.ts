import { BlendPoolMarkers } from '../BlendPoolMarkers';
import { erc20ABI, useAccount, useBalance, useContractRead } from 'wagmi';
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

  const { address } = useAccount();
  const { data: token0BalanceData } = useBalance({
    addressOrName: address,
    token: poolData.token0Address,
    watch: true,
  });
  const { data: token1BalanceData } = useBalance({
    addressOrName: address,
    token: poolData.token1Address,
    watch: true,
  });
  const { data: ethBalanceData } = useBalance({
    addressOrName: address,
    watch: true,
  });
  const { data: token0Allowance } = useContractRead({
    addressOrName: poolData.token0Address,
    contractInterface: erc20ABI,
    functionName: 'allowance',
    args: [address, poolData.poolAddress],
    cacheOnBlock: true,
    watch: true,
  });
  const { data: token1Allowance } = useContractRead({
    addressOrName: poolData.token1Address,
    contractInterface: erc20ABI,
    functionName: 'allowance',
    args: [address, poolData.poolAddress],
    cacheOnBlock: true,
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
        token0Allowance: new Big(token0Allowance.toString()),
        token1Allowance: new Big(token1Allowance.toString()),
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
