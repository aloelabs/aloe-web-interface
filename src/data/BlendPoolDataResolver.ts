import { BlendPoolMarkers, PrintFeeTier } from './BlendPoolMarkers';
import { GetTokenData } from './TokenData';
import { GetSiloData } from './SiloData';
import { FormatAddressStart } from '../util/FormatAddress';
import { UnknownTokenLogo } from '../assets/svg/tokens';
import { ethers } from 'ethers';
import Big from 'big.js';

import UniswapABI from '../assets/abis/UniswapV3Pool.json';
import { toBig } from '../util/Numbers';

export type BlendPoolDrawData = {
  token0Label: string;
  token1Label: string;

  token0Img: string;
  token1Img: string;

  silo0Label: string;
  silo1Label: string;

  silo0Name: string;
  silo1Name: string;

  feeTierText: string;
};

export function ResolveBlendPoolDrawData(poolData: BlendPoolMarkers) {
  const token0Data = GetTokenData(poolData.token0Address.toLowerCase());
  const token1Data = GetTokenData(poolData.token1Address.toLowerCase());

  const silo0Data = GetSiloData(poolData.silo0Address.toLowerCase());
  const silo1Data = GetSiloData(poolData.silo1Address.toLowerCase());

  const token0Label = token0Data.ticker
    ? token0Data.ticker
    : FormatAddressStart(poolData.token0Address, 4);
  const token1Label = token1Data.ticker
    ? token1Data.ticker
    : FormatAddressStart(poolData.token1Address, 4);

  const token0Img = token0Data.iconPath || UnknownTokenLogo;
  const token1Img = token1Data.iconPath || UnknownTokenLogo;

  const silo0Label = silo0Data.shortName
    ? silo0Data.shortName
    : FormatAddressStart(poolData.silo0Address, 4);
  const silo1Label = silo1Data.shortName
    ? silo1Data.shortName
    : FormatAddressStart(poolData.silo1Address, 4);

  const feeTierText = PrintFeeTier(poolData.feeTier);

  return {
    token0Label,
    token1Label,

    token0Img,
    token1Img,

    silo0Label,
    silo1Label,

    silo0Name: silo0Data?.name ?? '',
    silo1Name: silo1Data?.name ?? '',

    feeTierText,
  };
}

export interface Inventory {
  float: Big;
  silo: Big;
  uniswap: Big;
  total: Big;
}

export interface Inventory0 extends Inventory {
  denominatedInUnitsToken1: Inventory;
}

export interface Inventory1 extends Inventory {}

export interface InventoryRatios {
  float0Percent: number;
  float1Percent: number;
  silo0Percent: number;
  silo1Percent: number;
  uniswapPercent: number;
}

export interface BlendPoolStats {
  inventory0: Inventory0;
  inventory1: Inventory1;
  ratios: InventoryRatios;
  token1OverToken0: Big;
  tvl_0: Big;
  tvl_1: Big;
  outstandingShares: Big;
  token0Decimals: number;
  token1Decimals: number;
  recenterTimestamp: number;
  isInRange: boolean;
  IV: number;
}

export function logBig(value: Big) {
  console.log(value.toFixed(4));
}

function convertSqrtPriceX96(sqrtPriceX96: ethers.BigNumber): Big {
  const Q96 = ethers.BigNumber.from('0x1000000000000000000000000');
  const priceX96 = sqrtPriceX96.mul(sqrtPriceX96).div(Q96);
  return toBig(priceX96).div(toBig(Q96));
}

export async function ResolveBlendStats(
  blend?: ethers.Contract,
  silo0?: ethers.Contract,
  silo1?: ethers.Contract,
  token0?: ethers.Contract,
  token1?: ethers.Contract
): Promise<BlendPoolStats | null> {
  if (!blend || !silo0 || !silo1 || !token0 || !token1) return null;

  const results = await Promise.all([
    blend.getInventory(),
    silo0.balanceOf(blend.address),
    silo1.balanceOf(blend.address),
    token0.decimals(),
    token1.decimals(),
    token0.balanceOf(blend.address),
    token1.balanceOf(blend.address),
    blend.maintenanceBudget0(),
    blend.maintenanceBudget1(),
    blend.UNI_POOL(),
    blend.totalSupply(),
    blend.packedSlot(),
  ]);

  // ------------------------------------------ in-kind inventory measurement ------------------------------------------
  const inventory0 = toBig(results[0].inventory0);
  const inventory1 = toBig(results[0].inventory1);

  const inventory0_Silo = toBig(results[1]);
  const inventory1_Silo = toBig(results[2]);

  let inventory0_Float = toBig(results[5]);
  let inventory1_Float = toBig(results[6]);
  const maintenanceBudget0 = toBig(results[7]);
  const maintenanceBudget1 = toBig(results[8]);
  inventory0_Float = inventory0_Float.minus(maintenanceBudget0);
  inventory1_Float = inventory1_Float.minus(maintenanceBudget1);

  const inventory0_Uniswap = inventory0
    .minus(inventory0_Silo)
    .minus(inventory0_Float);
  const inventory1_Uniswap = inventory1
    .minus(inventory1_Silo)
    .minus(inventory1_Float);

  // ------------------------------------------------ pricing ------------------------------------------------
  const pairAddress = results[9];
  const pair = new ethers.Contract(pairAddress, UniswapABI, blend.provider);

  const slot0 = await pair.slot0();
  const token1OverToken0 = convertSqrtPriceX96(slot0.sqrtPriceX96);

  // --------------------------------- units of token1 inventory measurement ---------------------------------
  const inventory0_1 = inventory0.mul(token1OverToken0);
  const inventory0_Silo_1 = inventory0_Silo.mul(token1OverToken0);
  const inventory0_Float_1 = inventory0_Float.mul(token1OverToken0);
  const inventory0_Uniswap_1 = inventory0_Uniswap.mul(token1OverToken0);

  // -------------------------------------------- semantic meaning -------------------------------------------
  const tvl_1 = inventory0_1.plus(inventory1);
  const tvl_0 = tvl_1.div(token1OverToken0);

  let float0Percent = 0;
  let float1Percent = 0;
  let silo0Percent = 0;
  let silo1Percent = 0;
  let uniswapPercent = 0;
  if (!tvl_1.eq(0)) {
    float0Percent = inventory0_Float_1.div(tvl_1).toNumber();
    float1Percent = inventory1_Float.div(tvl_1).toNumber();
    silo0Percent = inventory0_Silo_1.div(tvl_1).toNumber();
    silo1Percent = inventory1_Silo.div(tvl_1).toNumber();
    uniswapPercent = inventory0_Uniswap_1
      .plus(inventory1_Uniswap)
      .div(tvl_1)
      .toNumber();
  }

  // ------------------------------------------------- ticks -------------------------------------------------
  const lower = results[11].primaryLower;
  const upper = results[11].primaryUpper;
  const IV = (1.0 - Math.pow(1.0001, - (upper - lower) / 2.0)) / 2.0

  return {
    inventory0: {
      float: inventory0_Float,
      silo: inventory0_Silo,
      uniswap: inventory0_Uniswap,
      total: inventory0,
      denominatedInUnitsToken1: {
        float: inventory0_Float_1,
        silo: inventory0_Silo_1,
        uniswap: inventory0_Uniswap_1,
        total: inventory0_1,
      },
    },
    inventory1: {
      float: inventory1_Float,
      silo: inventory1_Silo,
      uniswap: inventory1_Uniswap,
      total: inventory1,
    },
    ratios: {
      float0Percent,
      float1Percent,
      silo0Percent,
      silo1Percent,
      uniswapPercent,
    },
    token1OverToken0,
    tvl_0,
    tvl_1,
    outstandingShares: toBig(results[10]),
    token0Decimals: results[3],
    token1Decimals: results[4],
    recenterTimestamp: results[11]['recenterTimestamp'],
    isInRange: lower < slot0.tick && slot0.tick < upper,
    IV: IV * Math.sqrt(365),
  };
}
