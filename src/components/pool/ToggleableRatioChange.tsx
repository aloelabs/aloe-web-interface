import React from 'react';
import { SquareInputWithIcon } from '../common/Input';
import styled from 'styled-components';
import Big from 'big.js';

export type ToggleAbleRatioChangeProps = {
  closed: boolean;
  value: string;
  onChange: (newValue: string) => void;
  children: React.ReactNode;
};

const AnimatedDivHeight = styled.div<{ closed: boolean }>`
  height: fit-content;
  transition: all 0.25s ease-in-out;
  max-height: ${({ closed }) => (closed ? '0' : '1000px')};
  //transform: scale(${({ closed }) => (closed ? 1 : 1.5)});
`;

const formatPercentInput = (input: string): string | null => {
  if (input === '') {
    return '';
  }

  if (input === '.') {
    return '0.';
  }

  const re = /^[0-9\b]+[.\b]?[0-9\b]*$/;

  if (re.test(input)) {
    if (new Big(input).gt(new Big('100'))) {
      return '100';
    }

    return input;
  } else return null;
};

export default function ToggleableRatioChange(
  props: ToggleAbleRatioChangeProps
) {
  return (
    <AnimatedDivHeight
      className='w-full flex flex-col items-start justify-start px-2'
      closed={props.closed}
    >
      {/*<div className='w-full px-4 mt-2 mb-4 border-t-2 border-t-grey-100 h-0'/>*/}
      <div className='flex flex-row items-center justify-start w-full'>
        <span className='text-sm pr-3 text-grey-800'>
          Max&nbsp;Ratio&nbsp;Change
        </span>
        {/* <TextInput
          className='grow text-right'
          placeholder='0.00'
          disabled={props.closed}
          onChange={(event) => {
            const output = formatPercentInput(event.target.value);
            if (output !== null) {
              props.onChange(output);
            }
          }}
          value={props.value}
        />*/}
        <div className='mx-4 select-none'>%</div>
      </div>
      <div className='text-sm text-grey-800 my-3'>{props.children}</div>
    </AnimatedDivHeight>
  );
}
