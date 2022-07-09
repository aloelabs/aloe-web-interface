import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import ErrorIcon from '../../assets/svg/interaction_error.svg';
import { SquareInputWithMax } from './Input';
import { Text } from './Typography';

const INPUT_LABEL_TEXT_COLOR = 'rgba(255, 255, 255, 1)';
const BALANCE_VALUE_TEXT_COLOR = 'rgba(75, 105, 128, 1)';

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
        <Text size='M' weight='medium' color={INPUT_LABEL_TEXT_COLOR}>
          {props.tokenLabel}
        </Text>
        <Text size='XS' weight='medium' color={BALANCE_VALUE_TEXT_COLOR}>
          Balance: {props?.max || '-'}
        </Text>
      </div>
      <SquareInputWithMax
        size='L'
        inputClassName={props.value !== '' ? 'active' : ''}
        placeholder='0.00'
        onChange={(event) => {
          const output = formatNumberInput(event.target.value, props.max);
          if (output !== null) {
            props.onChange(output);
          }
        }}
        value={props.value}
        onMaxClick={() => {
          props.max && props.onChange(props.max.toString());
        }}
        maxDisabled={props.maxed}
        fullWidth={true}
      />
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
