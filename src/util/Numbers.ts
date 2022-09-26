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

/**
 * Formats a string to only include a numeric value
 * @param input the input to format
 * @param negative whether the input is negative
 * @returns the input formatted as a number
 */
export function formatNumberInput(input: string, negative?: boolean): string | null {
  //TODO: refactor this to handle edge cases better
  if (input === '' || input === '-') {
    return '';
  } else if (input === '.') {
    return negative ? '-0.' : '0.';
  }
  
  const re = new RegExp(`^${negative ? '-?' : ''}[0-9\b]+[.\b]?[0-9\b]{0,18}$`);

  if (re.test(input)) {
    // if (max && new Big(input).gt(new Big(max))) {
    //   return max;
    // }

    let result = input;
    if (negative && !input.startsWith('-')) {
      // If negative, add a negative sign if it isn't already there.
      result = `-${input}`;
    }

    return result;
  } else return null;
}
