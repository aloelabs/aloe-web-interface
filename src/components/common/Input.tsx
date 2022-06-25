import React, { ReactElement } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { classNames } from '../../util/ClassNames';

const INPUT_BG_COLOR = 'rgba(13, 23, 30, 1)';
const INPUT_ACTIVE_BG_COLOR = 'rgba(26, 41, 52, 1)';
const INPUT_TEXT_COLOR = 'rgba(75, 105, 128, 1)';
const INPUT_TEXT_COLOR_HOVER = 'rgba(204, 223, 237, 1)';
const INPUT_TEXT_COLOR_FOCUS = 'rgba(204, 223, 237, 1)';
const INPUT_TEXT_COLOR_DISABLED = 'rgba(75, 105, 128, 1)';
const INPUT_BORDER_COLOR = 'rgba(26, 41, 52, 1)';
const INPUT_CARET_COLOR = 'rgba(82, 182, 154, 1)';
const INPUT_ICON_COLOR_DISABLED = 'rgba(75, 105, 128, 1)';

const ICON_SIZES = {
  S: 19,
  M: 22,
  L: 24,
};

const ICON_PADDING = {
  S: 40,
  M: 48,
  L: 60,
};

const ICON_SPACING = {
  S: 8,
  M: 8,
  L: 12,
};

const INPUT_HEIGHT = {
  S: 35,
  M: 46,
  L: 56,
};

const INPUT_PADDING = {
  S: '8px 52px 8px 16px',
  M: '12px 64px 12px 20px',
  L: '16px 76px 16px 24px',
};

const INPUT_FONT_SIZE = {
  S: 14,
  M: 16,
  L: 18,
};

const INPUT_LINE_HEIGHT = {
  S: 18.9,
  M: 21.6,
  L: 24.3,
};

const MAX_BUTTON_WIDTH = {
  S: 24,
  M: 29,
  L: 33,
};

const MAX_BUTTON_HEIGHT = {
  S: 14,
  M: 16,
  L: 19,
};

const InputBase = styled.input.attrs(
  (props: { inputSize: 'S' | 'M' | 'L'; fullWidth?: boolean }) => props
)`
  ${tw`relative text-left flex-grow`}
  background-color: ${INPUT_BG_COLOR};
  color: ${INPUT_TEXT_COLOR};
  box-sizing: border-box;
  padding: ${(props) => INPUT_PADDING[props.inputSize]};
  font-size: ${(props) => INPUT_FONT_SIZE[props.inputSize]}px;
  line-height: ${(props) => INPUT_LINE_HEIGHT[props.inputSize]}px;
  /* Height is declared so we can have an inner border */
  height: ${(props) => INPUT_HEIGHT[props.inputSize]}px;
  width: ${(props) => (props.fullWidth ? '100%' : '320px')};
  caret-color: ${INPUT_CARET_COLOR};

  &:not(.no-border) {
    border: 1px solid ${INPUT_BORDER_COLOR};
  }

  &::placeholder {
    color: ${INPUT_TEXT_COLOR};
  }

  &:hover:not(:disabled) {
    color: ${INPUT_TEXT_COLOR_HOVER};

    &::placeholder {
      color: ${INPUT_TEXT_COLOR_HOVER};
    }
  }

  &.active,
  &:focus {
    outline: none;
    color: ${INPUT_TEXT_COLOR_FOCUS};
    background-color: ${INPUT_ACTIVE_BG_COLOR};

    &::placeholder {
      color: ${INPUT_TEXT_COLOR_FOCUS};
    }
  }

  &:focus:not(.no-border) {
    border: 1px solid;

    border: double 1px transparent;
    background-image: ${`linear-gradient(${INPUT_ACTIVE_BG_COLOR}, ${INPUT_ACTIVE_BG_COLOR})`},
      linear-gradient(90deg, #9baaf3 0%, #7bd8c0 100%);
    background-origin: border-box;
    background-clip: padding-box, border-box;
  }

  &:disabled {
    opacity: 0.4;
    color: ${INPUT_TEXT_COLOR_DISABLED};
    &::placeholder {
      color: ${INPUT_TEXT_COLOR_DISABLED};
    }
  }
`;

const RoundedInputWrapper = styled.div`
  ${tw`flex flex-col items-center justify-center relative`}
  border-radius: 100px;
  input {
    border-radius: 100px;
  }
`;

const SquareInputWrapper = styled.div`
  ${tw`flex flex-col items-center justify-center relative`}
  border-radius: 8px;
  input {
    border-radius: 8px;
  }
`;

const SvgWrapper = styled.div.attrs(
  (props: { size: 'S' | 'M' | 'L'; svgColorType: 'fill' | 'stroke'; isClickable: boolean; }) => props
)`
  ${tw`absolute`}

  top: ${(props) => `calc(50% - ${ICON_SIZES[props.size] / 2}px)`};
  pointer-events: ${(props) => (props.isClickable ? 'auto' : 'none')};
  cursor: ${(props) => (props.isClickable ? 'pointer' : 'default')};
  right: ${(props) =>
    `${
      ICON_PADDING[props.size] -
      ICON_SIZES[props.size] -
      ICON_SPACING[props.size]
    }px`};
  svg {
    width: ${(props) => ICON_SIZES[props.size]}px;
    height: ${(props) => ICON_SIZES[props.size]}px;
  }

  &.disabled {
    svg {
      path {
        ${(props) =>
          props.svgColorType === 'fill'
            ? `fill: ${INPUT_ICON_COLOR_DISABLED}`
            : `stroke: ${INPUT_ICON_COLOR_DISABLED}`}
      }
    }
  }
`;

const MaxButton = styled.button.attrs(
  (props: { size: 'S' | 'M' | 'L' }) => props
)`
  ${tw`ml-3 p-0`}
  color: rgba(0, 193, 67, 1);
  position: absolute;
  top: calc(50% - 9.45px);
  font-size: 14px;
  font-weight: 400;
  line-height: 18.9px;
  right: 24px;
  width: ${({ size }) => MAX_BUTTON_WIDTH[size]}px;
  height: ${({ size }) => MAX_BUTTON_HEIGHT[size]}px;

  &:disabled {
    color: rgba(75, 105, 128, 1);
  }
`;

export type InputProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  size: 'S' | 'M' | 'L';
  fullWidth?: boolean;
  wrapperClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  disabled?: boolean;
  onEnter?: () => void;
};

export function RoundedInput(props: InputProps) {
  const {
    value,
    onChange,
    size,
    fullWidth,
    wrapperClassName,
    inputClassName,
    placeholder,
    disabled,
    onEnter,
  } = props;
  return (
    <RoundedInputWrapper
      className={classNames(
        fullWidth ? 'w-full' : 'w-max',
        wrapperClassName || ''
      )}
    >
      <InputBase
        value={value}
        onChange={onChange}
        inputSize={size}
        placeholder={placeholder}
        disabled={disabled}
        fullWidth={fullWidth}
        className={inputClassName}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && onEnter) {
            onEnter();
          }
        }}
      />
    </RoundedInputWrapper>
  );
}

export function SquareInput(props: InputProps) {
  const {
    value,
    onChange,
    size,
    fullWidth,
    wrapperClassName,
    inputClassName,
    placeholder,
    disabled,
    onEnter,
  } = props;
  return (
    <SquareInputWrapper
      className={classNames(
        fullWidth ? 'w-full' : 'w-max',
        wrapperClassName || ''
      )}
    >
      <InputBase
        value={value}
        onChange={onChange}
        inputSize={size}
        placeholder={placeholder}
        disabled={disabled}
        fullWidth={fullWidth}
        className={inputClassName}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && onEnter) {
            onEnter();
          }
        }}
      />
    </SquareInputWrapper>
  );
}

export type InputWithMaxProps = InputProps & {
  onMaxClick: () => void;
  maxDisabled?: boolean;
};

export function SquareInputWithMax(props: InputWithMaxProps) {
  const {
    value,
    onChange,
    size,
    fullWidth,
    wrapperClassName,
    inputClassName,
    onMaxClick,
    maxDisabled,
    placeholder,
    disabled,
    onEnter,
  } = props;
  return (
    <SquareInputWrapper
      className={classNames(
        fullWidth ? 'w-full' : 'w-max',
        wrapperClassName || ''
      )}
    >
      <InputBase
        value={value}
        onChange={onChange}
        inputSize={size}
        placeholder={placeholder}
        disabled={disabled}
        fullWidth={fullWidth}
        className={classNames('no-border', inputClassName || '')}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && onEnter) {
            onEnter();
          }
        }}
      />
      <MaxButton
        size={size}
        onClick={onMaxClick}
        disabled={disabled || maxDisabled}
      >
        MAX
      </MaxButton>
    </SquareInputWrapper>
  );
}

export type InputWithIconProps = InputProps & {
  Icon: ReactElement;
  svgColorType: 'fill' | 'stroke';
  onIconClick?: React.MouseEventHandler<HTMLDivElement>;
};

export function RoundedInputWithIcon(props: InputWithIconProps) {
  const {
    value,
    size,
    onChange,
    fullWidth,
    wrapperClassName,
    inputClassName,
    Icon,
    placeholder,
    disabled,
    onIconClick,
    onEnter,
  } = props;
  return (
    <RoundedInputWrapper
      className={classNames(
        fullWidth ? 'w-full' : 'w-max',
        wrapperClassName || ''
      )}
    >
      <InputBase
        value={value}
        onChange={onChange}
        inputSize={size}
        placeholder={placeholder}
        disabled={disabled}
        fullWidth={fullWidth}
        className={inputClassName}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && onEnter) {
            onEnter();
          }
        }}
      />
      <SvgWrapper size={size} className={disabled ? 'disabled' : ''} onClick={onIconClick} isClickable={onIconClick !== undefined}>
        {Icon}
      </SvgWrapper>
    </RoundedInputWrapper>
  );
}

export function SquareInputWithIcon(props: InputWithIconProps) {
  const {
    value,
    size,
    onChange,
    Icon,
    fullWidth,
    wrapperClassName,
    inputClassName,
    placeholder,
    disabled,
    onIconClick,
    onEnter,
  } = props;
  return (
    <SquareInputWrapper
      className={classNames(
        fullWidth ? 'w-full' : 'w-max',
        wrapperClassName || ''
      )}
    >
      <InputBase
        value={value}
        onChange={onChange}
        inputSize={size}
        placeholder={placeholder}
        disabled={disabled}
        fullWidth={fullWidth}
        className={inputClassName}
        onKeyPress={onEnter !== undefined ? (e) => {
          if (e.key === 'Enter') {
            onEnter();
          }
        } : undefined}
      />
      <SvgWrapper size={size} className={disabled ? 'disabled' : ''} onClick={onIconClick} isClickable={onIconClick !== undefined}>
        {Icon}
      </SvgWrapper>
    </SquareInputWrapper>
  );
}
