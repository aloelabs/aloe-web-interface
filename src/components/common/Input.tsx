import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { classNames } from '../../util/ClassNames';

type TextInputProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  icon?: string;
};

const StyledInputWrapper = styled.div<{ disabled: boolean }>`
  ${tw`rounded-md border-2 border-transparent flex flex-row items-center justify-start`}

  box-sizing: border-box;

  position: relative;

  :hover {
    //background-image: linear-gradient(white, white), linear-gradient(100.12deg, #C08FFF -34.33%, #6CCFE4 60.51%, #88E2A1 117.32%);
    background-image: ${({ disabled }) => {
      return disabled
        ? 'none'
        : 'linear-gradient(white, white), linear-gradient(100.12deg, #C08FFF -34.33%, #6CCFE4 60.51%, #88E2A1 117.32%);';
    }};

    background-origin: border-box;
    background-clip: content-box, border-box;
  }
`;

const StyledInput = styled.input`
  border-radius: 4px;

  ${tw`text-grey-1000 placeholder-grey-600 bg-grey-50`}

  box-shadow: 0px 0px 0px 2px #2F485A;

  :hover:enabled:not(:focus) {
    box-shadow: none;
  }

  :focus {
    outline: none;
    box-shadow: 0px 0px 0px 2px #865ef2;
  }

  :disabled {
    ${tw`placeholder-grey-500`}
  }
`;

export function TextInput(props: TextInputProps) {
  return (
    <StyledInputWrapper
      disabled={props.disabled || false}
      className={props.className || ''}
    >
      {props.icon && (
        <img
          src={props.icon}
          alt=''
          className='w-6 h-6 translate-x-3 absolute'
        />
      )}
      {/* placeholder gets extra whitespace to accomodate icon, if present*/}
      <StyledInput
        disabled={props.disabled}
        className={classNames(
          'px-6 py-3 h-full w-full',
          props.icon ? 'pl-12' : ''
        )}
        placeholder={props.placeholder || ''}
        value={props.value}
        onChange={props.onChange}
      />
    </StyledInputWrapper>
  );
}
