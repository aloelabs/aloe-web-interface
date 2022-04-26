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

/**
 * @param percentage the percentage being rounded
 * @param precision the number of decimal places to round to
 * @returns the given percentage rounded to the given precision, without forcing a decimal point
 */
export function roundPercentage(percentage: number, precision: number): number {
  return Math.round((percentage + Number.EPSILON) * Math.pow(10, precision)) / Math.pow(10, precision);
}
