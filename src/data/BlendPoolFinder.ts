import axios from 'axios';
import { ethers } from 'ethers';
import { BlendPoolMarkers, FeeTier } from './BlendPoolMarkers';

import AloeBlendABI from '../assets/abis/AloeBlend.json';
import UniswapV3PoolABI from '../assets/abis/UniswapV3Pool.json';
import { API_URL } from './constants/Values';

export async function fetchBlendPoolData(
  address: string,
  provider: ethers.providers.BaseProvider
): Promise<BlendPoolMarkers> {
  const blend = new ethers.Contract(address, AloeBlendABI, provider);

  const promises: Promise<any>[] = [];
  promises.push(blend.TOKEN0());
  promises.push(blend.TOKEN1());
  promises.push(blend.silo0());
  promises.push(blend.silo1());
  promises.push(
    blend.UNI_POOL().then((poolAddress: string) => {
      const pair = new ethers.Contract(poolAddress, UniswapV3PoolABI, provider);
      return pair.fee();
    })
  );

  const results = await Promise.all(promises);
  let feeTier: FeeTier;
  switch (results[4]) {
    case 100:
      feeTier = FeeTier.ZERO_ZERO_ONE;
      break;
    case 500:
      feeTier = FeeTier.ZERO_ZERO_FIVE;
      break;
    case 3000:
      feeTier = FeeTier.ZERO_THREE;
      break;
    case 10000:
      feeTier = FeeTier.ONE;
      break;
    default:
      feeTier = FeeTier.UNKNOWN;
  }

  return {
    poolAddress: address,
    token0Address: results[0],
    token1Address: results[1],
    silo0Address: results[2],
    silo1Address: results[3],
    feeTier,
  };
}

export default async function findPools(provider: ethers.providers.BaseProvider) {
  const response = await axios.get(`${API_URL}/deployed_pools/1`);
  const data = response.data;
  const poolAddresses = data.map((pool: any) => pool['pool_address']);
  const promises: Promise<BlendPoolMarkers>[] = poolAddresses.map(
    (address: string) => fetchBlendPoolData(address, provider)
  );
  const BlendPoolMarkers = await Promise.all(promises);

  const poolDataMap = new Map<string, BlendPoolMarkers>();
  poolAddresses.forEach((element: string, i: number) => {
    poolDataMap.set(element, BlendPoolMarkers[i]);
  });
  return {
    poolDataMap,
    poolAddresses
  }
}
