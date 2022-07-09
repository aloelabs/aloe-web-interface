import Big from 'big.js';
import { ethers } from 'ethers';

const DEFAULT_PRECISION = 2;

const compactCurrencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumSignificantDigits: 3,
});

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
 * 
 * @param amount the amount of money in USD to format
 * @param placeholder the placeholder to use if the amount is null
 * @returns a formatted string representing the amount of money in USD
 */
export function formatUSD(amount: number | null, placeholder='-'): string {
  if (amount === null) {
    return placeholder;
  }
  return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

/**
 * 
 * @param amount the amount of money in USD to format
 * @param placeholder the placeholder to use if the amount is null
 * @returns a compact, formatted string representing the amount of money in USD
 */
export function formatUSDCompact(amount: number | null, placeholder='-'): string {
  if (amount === null) {
    return placeholder;
  }
  return compactCurrencyFormatter.format(amount);
}

/**
 * 
 * @param amount the amount of money in USD to format
 * @param placeholder the placeholder to use if the amount is null
 * @returns a formatted string representing the amount of money in USD using 
 * either the compact or regular format depending on the amount
 */
export function formatUSDAuto(amount: number | null, placeholder='-'): string {
  if (amount && amount < 1000) {
    return formatUSD(amount, placeholder);
  }
  return formatUSDCompact(amount, placeholder);
}

/**
 * @param percentage the percentage being rounded
 * @param precision the number of decimal places to round to
 * @returns the given percentage rounded to the given precision, without forcing a decimal point
 */
export function roundPercentage(
  percentage: number,
  precision?: number
): number {
  precision = precision || DEFAULT_PRECISION;
  return (
    Math.round((percentage + Number.EPSILON) * Math.pow(10, precision)) /
    Math.pow(10, precision)
  );
}
