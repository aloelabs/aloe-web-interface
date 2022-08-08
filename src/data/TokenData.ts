import {
  FeiLogo,
  UsdcLogo,
  WbtcLogo,
  WethLogo,
  TribeLogo,
  RaiLogo,
  LooksLogo,
} from '../assets/svg/tokens';

export type TokenData = {
  address: string;
  ticker?: string;
  name?: string;
  iconPath?: string;
  decimals?: number; // TODO: Move this out of here, so that other uses of tokendata don't have to async wait to draw
};

const TokenDataMap = new Map<string, TokenData>([
  // USDC
  [
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    {
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      name: 'USDC',
      ticker: 'USDC',
      iconPath: UsdcLogo,
      decimals: 6,
    },
  ],
  // WETH
  [
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    {
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      name: 'Wrapped Ether',
      ticker: 'WETH',
      iconPath: WethLogo,
      decimals: 18,
    },
  ],
  // WBTC
  [
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    {
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      name: 'Wrapped Bitcoin',
      ticker: 'WBTC',
      iconPath: WbtcLogo,
      decimals: 8,
    },
  ],
  // Fei
  [
    '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
    {
      address: '0x956f47f50a910163d8bf957cf5846d573e7f87ca',
      name: 'Fei USD',
      ticker: 'FEI',
      iconPath: FeiLogo,
      decimals: 18,
    },
  ],
  // Tribe
  [
    '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b',
    {
      address: '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b',
      name: 'Tribe',
      ticker: 'TRIBE',
      iconPath: TribeLogo,
      decimals: 18,
    },
  ],
  // Rai
  [
    '0x03ab458634910aad20ef5f1c8ee96f1d6ac54919',
    {
      address: '0x03ab458634910aad20ef5f1c8ee96f1d6ac54919',
      name: 'Rai Reflex Index',
      ticker: 'RAI',
      iconPath: RaiLogo,
      decimals: 18,
    },
  ],
  // Looks
  [
    '0xf4d2888d29d722226fafa5d9b24f9164c092421e',
    {
      address: '0xf4d2888d29d722226fafa5d9b24f9164c092421e',
      name: 'LooksRare Token',
      ticker: 'LOOKS',
      iconPath: LooksLogo,
      decimals: 18,
    },
  ],
]);

export function getTokens(): TokenData[] {
  return Array.from(TokenDataMap.values());
}

export function GetTokenData(address: string): TokenData {
  if (TokenDataMap.has(address)) {
    return TokenDataMap.get(address)!;
  } else
    return {
      address,
    };
}
