import React, { createContext, useEffect, useState } from 'react';
import { BlendPoolData } from '../BlendPoolData';
import findPools, { fetchBlendPoolData } from '../BlendPoolFinder';
import {
  BLEND_FACTORY_ADDRESS,
  BLEND_FACTORY_CREATION_BLOCK,
} from '../constants/Addresses';
import { useProvider } from 'wagmi';

export interface IBlendTableContext {
  poolAddresses: string[];
  poolDataMap: Map<string, BlendPoolData>;
  fetchPoolData: (address: string) => void;
}

const defaultState: IBlendTableContext = {
  poolAddresses: [],
  poolDataMap: new Map<string, BlendPoolData>(),
  fetchPoolData: (address: string) => {},
};

export const BlendTableContext =
  createContext<IBlendTableContext>(defaultState);

export type BlendTableContextProviderProps = {
  children?: React.ReactNode;
};

export function BlendTableProvider(props: BlendTableContextProviderProps) {
  const [contextState, setContextState] =
    useState<IBlendTableContext>(defaultState);
  const [loading, setLoading] = useState<boolean>(false);
  const provider = useProvider();

  const fetchBlendPoolDataCallback = React.useCallback<
    (address: string) => void
  >(
    (address: string) => {
      fetchBlendPoolData(address, provider).then((poolData) => {
        contextState.poolDataMap.set(address, poolData);
      });
    },
    [provider, contextState]
  );

  useEffect(() => {
    if (!loading) {
      setContextState((state) => {
        return {
          ...state,
          fetchPoolData: fetchBlendPoolDataCallback,
        };
      });
      const loadAsync = async () => {
        const searchResults = await findPools(
          BLEND_FACTORY_ADDRESS,
          BLEND_FACTORY_CREATION_BLOCK,
          provider
        );
        if (searchResults !== null) {
          setContextState((x) => {
            return {
              ...x,
              poolAddresses: searchResults.poolAddresses,
              poolDataMap: new Map<string, BlendPoolData>([
                ...Array.from(x.poolDataMap.entries()),
                ...Array.from(searchResults.poolDataMap.entries()),
              ]),
            };
          });
        } else {
          setTimeout(() => {
            setLoading(false);
          }, 5000);
        }
      };
      loadAsync();

      setLoading(true);
    }
  }, [fetchBlendPoolDataCallback, loading, provider]);

  return (
    <BlendTableContext.Provider value={contextState}>
      {props.children}
    </BlendTableContext.Provider>
  );
}
