import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import SearchIcon from '../../assets/svg/search_new.svg';

/**
 * TODO: Make this more standardised.
 */

const SEARCH_BG_COLOR = 'rgba(13, 23, 30, 1)';
const SEARCH_TEXT_COLOR = 'rgba(75, 105, 128, 1)';
const SEARCH_TEXT_COLOR_HOVER = 'rgba(204, 223, 237, 1)';
const SEARCH_TEXT_COLOR_FOCUS = 'rgba(204, 223, 237, 1)';
const SEARCH_BORDER_COLOR = 'rgba(26, 41, 52, 1)';
const SEARCH_BORDER_COLOR_FOCUS = 'rgba(134, 94, 242, 1)';

const SearchWrapper = styled.div`
  ${tw`flex flex-col items-center justify-center`}
  box-sizing: border-box;
  position: relative;
`;

const SearchInput = styled.input`
  background-color: ${SEARCH_BG_COLOR};
  color: ${SEARCH_TEXT_COLOR};
  border: 1px solid ${SEARCH_BORDER_COLOR};
  box-sizing: border-box;
  border-radius: 100px;
  padding: 16px 76px 16px 24px;
  line-height: 24px;
  /* Height is declared so we can have an inner border */
  height: 56px;
  width: 410px;
  &::placeholder {
    color: ${SEARCH_TEXT_COLOR};
  }
  &:focus {
    outline: none;
    /* TODO: Not sure which to use */
    box-shadow: 0px 0px 0px 2px ${SEARCH_BORDER_COLOR_FOCUS};//rgba(255, 255, 255, 0.2);
    color: ${SEARCH_TEXT_COLOR_FOCUS};
    &::placeholder {
      color: ${SEARCH_TEXT_COLOR_FOCUS};
    }
  }
  &:hover {
    color: ${SEARCH_TEXT_COLOR_HOVER};
    &::placeholder {
      color: ${SEARCH_TEXT_COLOR_HOVER};
    }
  }
`;

const SearchIconWrapper = styled.img`
  position: absolute;
  right: 20px;
  /* Make input under still clickable */
  pointer-events: none;
`;

export type SearchProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Search(props: SearchProps) {
  return (
    <SearchWrapper>
      <SearchInput placeholder='Search by name, symbol or address' value={props.value} onChange={props.onChange} />
      <SearchIconWrapper src={SearchIcon} alt='Search Icon' />
    </SearchWrapper>
  );
}
