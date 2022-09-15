import { useEffect, useState } from 'react';
import { BlendPoolStats, ResolveBlendStats } from '../BlendPoolDataResolver';
import { useContract, useProvider, useBlockNumber } from 'wagmi';
import AloeBlendABI from '../../assets/abis/AloeBlend.json';
import SiloABI from '../../assets/abis/Silo.json';
import ERC20ABI from '../../assets/abis/ERC20.json';
import { BlendPoolMarkers } from '../BlendPoolMarkers';

export function useBlendStats(poolData: BlendPoolMarkers) {
  const [blendStats, setBlendStats] = useState<BlendPoolStats | null>(null);
  const { data: blockNumberData } = useBlockNumber();

  const provider = useProvider();
  const blend = useContract({
    addressOrName: poolData.poolAddress,
    contractInterface: AloeBlendABI,
    signerOrProvider: provider,
  });
  const silo0 = useContract({
    addressOrName: poolData.silo0Address,
    contractInterface: SiloABI,
    signerOrProvider: provider,
  });
  const silo1 = useContract({
    addressOrName: poolData.silo1Address,
    contractInterface: SiloABI,
    signerOrProvider: provider,
  });
  const token0 = useContract({
    addressOrName: poolData.token0Address,
    contractInterface: ERC20ABI,
    signerOrProvider: provider,
  });
  const token1 = useContract({
    addressOrName: poolData.token1Address,
    contractInterface: ERC20ABI,
    signerOrProvider: provider,
  });

  useEffect(() => {
    const collectStats = async () => {
      const stats = await ResolveBlendStats(
        blend,
        silo0,
        silo1,
        token0,
        token1
      );
      setBlendStats(stats);
    };

    collectStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poolData, blockNumberData]);

  return blendStats;
}
