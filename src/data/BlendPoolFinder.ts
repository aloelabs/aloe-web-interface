import axios from 'axios';
import { ethers } from 'ethers';
import { BlendPoolData, FeeTier } from './BlendPoolData';

import AloeBlendABI from '../assets/abis/AloeBlend.json';
import UniswapV3PoolABI from '../assets/abis/UniswapV3Pool.json';

export async function fetchBlendPoolData(
  address: string,
  provider: ethers.providers.BaseProvider
): Promise<BlendPoolData> {
  const blend = new ethers.Contract(address, AloeBlendABI, provider);

  const promises: Promise<any>[] = [];
  promises.push(blend.TOKEN0());
  promises.push(blend.TOKEN1());
  promises.push(blend.silo0());
  promises.push(blend.silo1());
  promises.push(
    blend.UNI_POOL().then((poolAddress: string) => {
      const pair = new ethers.Contract(poolAddress, UniswapV3PoolABI, provider);
      return pair.tickSpacing();
    })
  );

  const results = await Promise.all(promises);
  let feeTier: FeeTier;
  switch (results[4]) {
    case 1:
      feeTier = FeeTier.ZERO_ZERO_ONE;
      break;
    case 10:
      feeTier = FeeTier.ZERO_ZERO_FIVE;
      break;
    case 30:
      feeTier = FeeTier.ZERO_THREE;
      break;
    case 100:
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

export default async function findPools(
  factoryAddress: string,
  factoryCreationBlock: number,
  provider: ethers.providers.BaseProvider
) {
  const params: Map<string, string | number> = new Map();
  params.set('fromBlock', factoryCreationBlock);
  params.set('toBlock', 'latest');
  params.set('address', factoryAddress);
  params.set(
    'topic0',
    '0xfb83ca910097c70646250238daf4abcd392f91992164890d564d81e0e218f2b2'
  );
  params.set('apikey', process.env.REACT_APP_ETHERSCAN_API_KEY ?? '');

  const formattedParams = Array.from(params.entries())
    .map((item) => `${item[0]}=${item[1]}`)
    .join('&');
  const response = await axios.get<any>(
    `https://api.etherscan.io/api?module=logs&action=getLogs&${formattedParams}`
  );

  const factoryLogs = response?.data?.result;
  if (!factoryLogs) return null;

  const poolAddresses = factoryLogs.map((log: any) => {
    const address = String(log['topics'][1]).slice(-40);
    return `0x${address}`;
  });

  const promises: Promise<BlendPoolData>[] = poolAddresses.map(
    (address: string) => fetchBlendPoolData(address, provider)
  );
  const blendPoolData = await Promise.all(promises);

  const poolDataMap = new Map<string, BlendPoolData>();
  poolAddresses.forEach((element: string, i: number) => {
    poolDataMap.set(element, blendPoolData[i]);
  });
  return {
    poolDataMap,
    poolAddresses
  };
}
