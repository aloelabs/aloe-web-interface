import { add, addMinutes, subMinutes } from 'date-fns/esm';

const UNIX_TIMESTAMP_REGEX = /^[0-9]{10}$/;

/**
 *
 * @param date a date
 * @param step a duration to add to the date
 * @returns the date plus the duration that ignores timezone differences
 */
export function agnosticAdd(date: Date, step: Duration) : Date {
  const originalTimezoneOffset = date.getTimezoneOffset();
  const updatedDate = add(date, step);
  const updatedTimezoneOffset = updatedDate.getTimezoneOffset();

  const timezoneDifference = originalTimezoneOffset - updatedTimezoneOffset;
  return timezoneDifference >= 0
    ? addMinutes(updatedDate, timezoneDifference)
    : subMinutes(updatedDate, Math.abs(timezoneDifference));
}

/**
 * Note: Only works if the dates are equidistant apart
 * @param dates Array of dates
 * @param n number of dates to return (+/- 1)
 * @returns Array of dates (as string) that are evenly spaced throughout the given array of dates
 */
export function getEvenlySpacedDates(dates: string[], n: number) : string[] {
  n += 2;
  const offset = dates.length % n;
  const sliceStart = Math.floor(offset / 2);
  const sliceEnd = dates.length - Math.ceil(offset / 2);
  let updatedDates = [...dates];
  // Cut off a bit of the beginning and end to make sure the graph is centered
  updatedDates = dates.slice(sliceStart, sliceEnd);
  const step = Math.ceil(updatedDates.length / n);
  const result = [];
  for (let i = 0; i < n; i++) {
    result.push(updatedDates[i * step] || dates[0]);//TODO: find a better way to handle this
  }
  return result;
}

export function isUnixTimestamp(str: string): boolean {
  return UNIX_TIMESTAMP_REGEX.test(str);
}

/**
 * 
 * @param timestamp a timestamp (either a string or a number)
 * @returns either a string or number, depending on the input, but if the input was a number
 * and it was a unix timestamp (i.e. 10 digits), it will return a 13-digit number representing
 * the unix timestamp with the milliseconds appended
 */
export function fixTimestamp(timestamp: string | number): string | number {
  return isUnixTimestamp(timestamp.toString()) ? parseInt(timestamp.toString()) * 1000 : timestamp;
}
