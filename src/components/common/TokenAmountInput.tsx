import React from 'react';
import { TextInput } from './Input';

export type TokenAmountInputProps = {
  onChange: (newValue: string) => void;
  max?: string;
  value: string;
  tokenLabel: string;
};

const formatNumberInput = (input: string, max?: string): string | null => {
  if (input === '') {
    return '';
  }

  if (input === '.') {
    return '0.';
  }

  const re = /^[0-9\b]+[.\b]?[0-9\b]{0,18}$/;

  if (re.test(input)) {
    // if (max && new Big(input).gt(new Big(max))) {
    //   return max;
    // }

    return input;
  } else return null;
};

export default function TokenAmountInput(props: TokenAmountInputProps) {
  return (
    <div className='flex flex-row items-center justify-center p-2'>
      <span className='text-sm w-16 pr-3 text-grey-800 text-right'>
        {props.tokenLabel}
      </span>
      <TextInput
        className='text-left grow'
        placeholder='0.0'
        onChange={(event) => {
          const output = formatNumberInput(event.target.value, props.max);
          if (output !== null) {
            props.onChange(output);
          }
        }}
        value={props.value}
      />
      <button
        onClick={() => {
          props.max && props.onChange(props.max.toString());
        }}
        className='text-green-500 text-sm ml-3 p-0 w-10'
      >
        MAX
      </button>
    </div>
  );
}
