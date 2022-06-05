import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import ErrorIcon from '../../assets/svg/interaction_error.svg';

export type TokenAmountInputProps = {
  onChange: (newValue: string) => void;
  max?: string;
  maxed?: boolean;
  value: string;
  tokenLabel: string;
  error?: boolean;
  errorMessage?: string;
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

const InputLabel = styled.div`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
`;

const BalanceValue = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: rgba(75, 105, 128, 1);
`;

const InputWrapper = styled.div`
  position: relative;
`;

const AmountInput = styled.input`
  ${tw`text-left flex-grow w-full relative`}
  background-color: rgba(13, 23, 30, 1);
  padding: 16px 64px 16px 24px;
  border-radius: 8px;
  color: rgba(204, 223, 237, 1);
  caret-color: rgba(82, 182, 154, 1);

  &::placeholder {
    color: rgba(75, 105, 128, 1);
  }
  
  &:focus,
  &.active {
    outline: none;
    background-color: rgba(26, 41, 52, 1);
  }
`;

const MaxButton = styled.button`
  ${tw`text-sm ml-3 p-0 w-10`}
  color: rgba(0, 193, 67, 1);
  position: absolute;
  top: calc(50% - 9.45px);
  font-size: 14px;
  font-weight: 400;
  line-height: 18.9px;
  right: 24px;

  &:disabled {
    color: rgba(75, 105, 128, 1);
  }
`;

const ErrorMessageWrapper = styled.div`
  ${tw`flex items-center gap-x-2 mt-2`}
`;

const ErrorMessageText = styled.div`
  color: rgba(235, 87, 87, 1);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`;

export default function TokenAmountInput(props: TokenAmountInputProps) {
  return (
    <div className='w-full'>
        <div className='flex items-center justify-between mb-2'>
          <InputLabel>{props.tokenLabel}</InputLabel>
          <BalanceValue>Balance: {props?.max || '-'}</BalanceValue>
        </div>
        <InputWrapper>
          <AmountInput
            className={props.value !== '' ? 'active' : ''}
            placeholder='0.00'
            onChange={(event) => {
              const output = formatNumberInput(event.target.value, props.max);
              if (output !== null) {
                props.onChange(output);
              }
            }}
            value={props.value}
          />
          <MaxButton
            onClick={() => {
              props.max && props.onChange(props.max.toString());
            }}
            className=''
            disabled={props.maxed}
          >
            MAX
          </MaxButton>
        </InputWrapper>
        {props.error && (
          <ErrorMessageWrapper>
            <img src={ErrorIcon} width={16} height={16} alt='error' />
            <ErrorMessageText>
              {props.errorMessage ? props.errorMessage : 'Invalid input'}
            </ErrorMessageText>
          </ErrorMessageWrapper>
        )}
    </div>
  );
}
