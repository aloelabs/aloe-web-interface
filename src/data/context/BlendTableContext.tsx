import React, { createContext, useEffect, useState } from 'react';
import { useProvider } from 'wagmi';
import findPools, { fetchBlendPoolData } from '../BlendPoolFinder';
import { BlendPoolMarkers } from '../BlendPoolMarkers';

export interface IBlendTableContext {
  poolAddresses: string[];
  poolDataMap: Map<string, BlendPoolMarkers>;
  fetchPoolData: (address: string) => void;
}

const defaultState: IBlendTableContext = {
  poolAddresses: [],
  poolDataMap: new Map<string, BlendPoolMarkers>(),
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
        const searchResults = await findPools(provider);
        if (searchResults !== null) {
          setContextState((x) => {
            return {
              ...x,
              poolAddresses: searchResults.poolAddresses,
              poolDataMap: new Map<string, BlendPoolMarkers>([
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
