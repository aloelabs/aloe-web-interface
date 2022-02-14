import React from 'react';
import Big from 'big.js';
import { useBlockNumber, useProvider, useContext } from 'wagmi';
import { ethers } from 'ethers';
import Erc20Abi from '../../assets/abis/ERC20.json';

export type UseAllowanceConfig = {
  /** Holder Address or ENS name */
  holderAddressOrName?: string;
  /** Spender Address or ENS name */
  spenderAddressOrName?: string;
  /** Disables fetching */
  skip?: boolean;
  /** ERC-20 address */
  token?: string;
  /** Subscribe to changes */
  watch?: boolean;
};

type State = {
  allowance?: Big;
  error?: Error;
  loading?: boolean;
};

const initialState: State = {
  loading: false,
};

export function useAllowance({
  holderAddressOrName,
  spenderAddressOrName,
  skip,
  token,
  watch,
}: UseAllowanceConfig = {}) {
  const wagmiContext = useContext();
  const cacheBuster = wagmiContext.state.cacheBuster;
  const provider = useProvider();
  const [{ data: blockNumber }] = useBlockNumber({ skip: true, watch });
  const [state, setState] = React.useState<State>(initialState);

  // console.log(`holderAddressOrName: ${holderAddressOrName}`,
  //   `spenderAddressOrName ${spenderAddressOrName}`,
  //   `skip ${skip}`,
  //   `token ${token}`,
  //   `watch ${watch}`
  // );

  const getAllowance = React.useCallback(
    async (config?: {
      holderAddressOrName: string;
      spenderAddressOrName: string;
      token: UseAllowanceConfig['token'];
    }) => {
      try {
        const config_ = config ?? {
          holderAddressOrName,
          spenderAddressOrName,
          token,
        };
        if (
          !config_.holderAddressOrName ||
          !config_.spenderAddressOrName ||
          !config_.token
        )
          throw new Error('addresses are required');

        setState((x) => ({ ...x, error: undefined, loading: true }));
        let allowance: State['allowance'];
        const contract = new ethers.Contract(config_.token, Erc20Abi, provider);
        allowance = new Big(
          await contract.allowance(holderAddressOrName, spenderAddressOrName)
        );
        setState((x) => ({ ...x, allowance, loading: false }));

        return { data: allowance, error: undefined };
      } catch (error_) {
        const error = error_ as Error;
        console.log(error);
        setState((x) => ({ ...x, error, loading: false }));
        return { data: undefined, error };
      }
    },
    [holderAddressOrName, spenderAddressOrName, provider, token]
  );

  // Fetch balance when deps or chain changes
  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    if (skip || !holderAddressOrName || !spenderAddressOrName) return;

    let didCancel = false;
    if (didCancel) return;
    getAllowance({ holderAddressOrName, spenderAddressOrName, token });

    return () => {
      didCancel = true;
    };
  }, [holderAddressOrName, spenderAddressOrName, cacheBuster, skip, token]);
  /* eslint-enable react-hooks/exhaustive-deps */

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    if (!watch) return;
    if (!blockNumber) return;
    if (!holderAddressOrName || !spenderAddressOrName) return;
    getAllowance({ holderAddressOrName, spenderAddressOrName, token });
  }, [blockNumber]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return [
    {
      data: state.allowance,
      error: state.error,
      loading: state.loading,
    },
    getAllowance,
  ] as const;
}
