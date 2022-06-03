import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ELLIPSIS, usePagination } from '../../data/hooks/UsePagination';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import tw from 'twin.macro';

const MAX_DISPLAYED_COUNT = 6;
const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

const Wrapper = styled.div`
  ${tw`w-full flex justify-between`}
  margin-top: 42px;
  margin-bottom: 34px;
`;

// Temporary until the dropdown component is merged
const TemporaryDropdown = styled.select`
  ${tw`flex justify-center items-center`}
  width: 109px;
  height: 42px;
  background-color: transparent;
  outline: 1px solid rgba(26, 41, 52, 1);
  border-radius: 100px;
  font-size: 12px;
  padding: 12px 8px 12px 12px;
`;

const PaginationRangeText = styled.span`
  font-size: 14px;
  white-space: nowrap;
`;

const PaginationContainer = styled.div`
  ${tw`flex justify-end items-center`}
  flex-wrap: wrap;
  width: 100%;
`;

const ChevronButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border: 1px solid rgba(13, 23, 30, 1);
  border-radius: 25px;
  width: 40px;
  height: 40px;
`;

const ChevronLeft = styled(ChevronLeftIcon)`
  width: 24px;
  height: 24px;
  fill: rgba(75, 105, 128, 1);
`;

const ChevronRight = styled(ChevronRightIcon)`
  width: 24px;
  height: 24px;
  fill: rgba(75, 105, 128, 1);
`;

const PageButton = styled.button`
  background: transparent;
  color: rgba(75, 105, 128, 1);
  line-height: 24px;
  width: 40px;
  height: 40px;

  &.active {
    color: rgba(82, 182, 154, 1);
  }
`;

const EllipsisWrapper = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  color: rgba(75, 105, 128, 1);
  line-height: 24px;
  width: 40px;
  height: 40px;
`;

export type PaginationProps = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
};

export default function Pagination(props: PaginationProps) {
  const {
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
    onItemsPerPageChange,
  } = props;

  const firstPage = 1;
  const lastPage = Math.ceil(totalItems / itemsPerPage);

  useEffect(() => {
    // If the current page is out of range, set it to the last page
    if (currentPage > lastPage) {
      onPageChange(lastPage);
    }
  });

  const paginationRange = usePagination({
    totalItems,
    itemsPerPage,
    currentPage,
    maxDisplayedCount: MAX_DISPLAYED_COUNT,
  });

  const prevPage = () => {
    onPageChange(currentPage - 1);
  };

  const nextPage = () => {
    onPageChange(currentPage + 1);
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(startItem + itemsPerPage - 1, totalItems);

  return (
    <Wrapper>
      <div className='flex items-center gap-4'>
        <TemporaryDropdown
          defaultValue={itemsPerPage}
          onChange={(e) =>
            onItemsPerPageChange(parseInt(e.target.selectedOptions[0].value))
          }
        >
          {ITEMS_PER_PAGE_OPTIONS.map((itemsPerPageOption) => (
            <option key={itemsPerPageOption} value={itemsPerPageOption}>
              {itemsPerPageOption} Results
            </option>
          ))}
        </TemporaryDropdown>
        <PaginationRangeText>
          {startItem} - {endItem} of {totalItems}
        </PaginationRangeText>
      </div>
      <PaginationContainer>
        <ChevronButton onClick={prevPage} disabled={currentPage === firstPage}>
          <ChevronLeft />
        </ChevronButton>
        {paginationRange.map((page, index) => {
          if (page === ELLIPSIS) {
            return <EllipsisWrapper key={index}>&#8230;</EllipsisWrapper>;
          }
          return (
            <PageButton
              key={index}
              className={page === currentPage ? 'active' : ''}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PageButton>
          );
        })}
        <ChevronButton onClick={nextPage} disabled={currentPage === lastPage}>
          <ChevronRight />
        </ChevronButton>
      </PaginationContainer>
    </Wrapper>
  );
}
