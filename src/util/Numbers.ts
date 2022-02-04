import Big from 'big.js';
import { ethers } from 'ethers';

export function toBig(value: ethers.BigNumber): Big {
  return new Big(value.toString());
}

export function String1E(decimals: number): string {
  return `1${'0'.repeat(decimals)}`;
}

export function prettyFormatBalance(amount?: Big, decimals?: number): string {
  if (!amount || !decimals) {
    return '-';
  }
  return amount.div(String1E(decimals)).toFixed(decimals > 6 ? 4 : 2);
}
