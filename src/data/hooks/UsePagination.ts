import { useMemo } from 'react';

export const ELLIPSIS = -1;

const range = (start: number, end: number) => {
  const length = end - start + 1;
  return Array.from({ length }, (_, i) => i + start);
};

export type UsePaginationState = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  maxDisplayedCount: number; // Max displayed count of page numbers (not including ellipsis)
};

export function usePagination(paginationState: UsePaginationState) {
  const { totalItems, itemsPerPage, currentPage, maxDisplayedCount } =
    paginationState;
  const paginationRange = useMemo(() => {
    const numberOfPages = Math.ceil(totalItems / itemsPerPage);

    if (maxDisplayedCount >= numberOfPages) {
      /* example: (1 2 3 4 5) */
      return range(1, numberOfPages);
    }

    const start = Math.max(1, currentPage - 1);
    const end = Math.min(numberOfPages, currentPage + 1);
    const showStartEllipsis = start > 2;
    const showEndEllipsis = end < numberOfPages - 1;

    if (showStartEllipsis && showEndEllipsis) {
      /* example: (1 ... 4 5 6 ... 10) */
      return [1, ELLIPSIS, ...range(start, end), ELLIPSIS, numberOfPages];
    } else if (showStartEllipsis) {
      /* example: (1 ... 6 7 8 9 10) */
      return [
        1,
        ELLIPSIS,
        ...range(numberOfPages - (maxDisplayedCount - 2), numberOfPages),
      ];
    } else if (showEndEllipsis) {
      /* example: (1 2 3 4 5 ... 10) */
      return [...range(1, maxDisplayedCount - 1), ELLIPSIS, numberOfPages];
    } else {
      /* Shouldn't happen */
      return range(start, end);
    }
  }, [totalItems, itemsPerPage, currentPage, maxDisplayedCount]);
  return paginationRange;
}
