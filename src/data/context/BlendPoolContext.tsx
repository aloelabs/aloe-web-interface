import { BlendPoolMarkers } from '../BlendPoolMarkers';
import React, { createContext } from 'react';
import { BlendPoolStats } from '../BlendPoolDataResolver';
import { useBlendStats } from '../hooks/UseBlendStats';

export interface IBlendPoolContext {
  poolStats: BlendPoolStats | null;
}

const defaultState: IBlendPoolContext = {
  poolStats: null,
};

export const BlendPoolContext = createContext<IBlendPoolContext>(defaultState);

export type BlendPoolContextProviderProps = {
  poolData: BlendPoolMarkers;
  children?: React.ReactNode;
};

export function BlendPoolProvider(props: BlendPoolContextProviderProps) {
  const blendStats = useBlendStats(props.poolData);

  return (
    <BlendPoolContext.Provider
      value={{
        poolStats: blendStats,
      }}
    >
      {props.children}
    </BlendPoolContext.Provider>
  );
}
