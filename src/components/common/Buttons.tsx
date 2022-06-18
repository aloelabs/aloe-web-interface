import React, { ReactElement } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { classNames } from '../../util/ClassNames';
import LeftChevron from '../../assets/svg/left_chevron.svg';

const DEFAULT_BLACK = 'rgba(0, 0, 0, 1)';
const DISABLED_BLACK = 'rgba(7, 14, 18, 1)';
const DEFAULT_WHITE = 'rgba(255, 255, 255, 1)';
const DISABLED_WHITE = 'rgba(255, 255, 255, 0.4)';

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

const EMPTY_PADDING = {
  S: 8,
  M: 12,
  L: 16,
};

export const BaseButton = styled.button.attrs(
  (props: {
    size: 'S' | 'M' | 'L';
    paddingLeft?: number;
    paddingRight?: number;
    empty?: boolean;
    backgroundColor?: string;
    color?: string;
    fillWidth?: boolean;
    linkTo?: string;
  }) => props
)`
  ${tw`flex flex-row justify-center items-center gap-3`}
  width: max-content;
  /* font-family: 'Satoshi-Variable'; */
  font-weight: 700;
  border-radius: 8px;
  ${(props) => {
    switch (props.size) {
      case 'S':
        return `
          font-size: 14px;
          line-height: 18.9px;
          padding: 8px 16px;
        `;
      case 'M':
        return `
          font-size: 16px;
          line-height: 21.6px;
          padding: 12px 20px;
        `;
      case 'L':
        return `
          font-size: 18px;
          line-height: 24.3px;
          padding: 16px 24px;
        `;
    }
  }};

  ${(props) => {
    if (props.paddingLeft && !props.empty) {
      return `padding-left: ${props.paddingLeft}px;`;
    }
    if (props.paddingRight && !props.empty) {
      return `padding-right: ${props.paddingRight}px;`;
    }
    if (props.empty) {
      return `padding: ${EMPTY_PADDING[props.size]}px; width: ${
        ICON_SIZES[props.size]
      }px; height: ${ICON_SIZES[props.size]}px; box-sizing: content-box;`;
    }
    if (props.fillWidth) {
      return `width: 100%;`;
    }
  }};

  &:focus-visible {
    outline: none;
  }
`;

export const FilledGradientButton = styled(BaseButton)`
  background: linear-gradient(90deg, #9baaf3 0%, #7bd8c0 100%);
  color: rgba(0, 0, 0, 1);

  ${(props) => {
    if (props.backgroundColor) {
      return `background: ${props.backgroundColor};`;
    }
  }};

  ${(props) => {
    if (props.color) {
      return `color: ${props.color};`;
    }
  }};

  &:not(:disabled):hover {
    box-shadow: 0px 8px 16px -4px rgba(126, 213, 197, 0.08),
      0px 8px 24px -4px rgba(154, 173, 241, 0.12);
  }

  &:disabled {
    color: rgba(7, 14, 18, 1);
    background: linear-gradient(
      90deg,
      rgba(155, 170, 243, 0.4) 0%,
      rgba(123, 216, 192, 0.4) 100%
    );
    box-shadow: none;
  }

  &:focus-visible {
    box-shadow: 0px 0px 0px 2px rgba(7, 14, 18, 1),
      0px 0px 0px 4px rgba(255, 255, 255, 0.2);
  }
`;

export const FilledGreyButton = styled(BaseButton)`
  background-color: rgba(26, 41, 52, 1);
  color: rgba(255, 255, 255, 1);

  ${(props) => {
    if (props.backgroundColor) {
      return `background: ${props.backgroundColor};`;
    }
  }};

  ${(props) => {
    if (props.color) {
      return `color: ${props.color};`;
    }
  }};

  &:not(:disabled):hover {
    position: relative;
    box-shadow: 0px 8px 16px -4px rgba(126, 213, 197, 0.08),
      0px 8px 24px -4px rgba(154, 173, 241, 0.12);

    &:before {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: 8px;
      padding: 1.5px;
      background: rgba(255, 255, 255, 1);
      -webkit-mask: linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
  }

  &:disabled {
    background-color: rgba(13, 23, 30, 1);
    color: rgba(255, 255, 255, 0.4);
    box-shadow: none;
  }

  &:focus-visible {
    position: relative;
    box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.2);

    &:before {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: 8px;
      padding: 2px;
      background: rgba(7, 14, 18, 1);
      -webkit-mask: linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
  }
`;

export const OutlinedGradientButton = styled(BaseButton)`
  ${tw`relative`}
  overflow: hidden;

  ${(props) => {
    if (props.backgroundColor) {
      return `background: ${props.backgroundColor}`;
    }
  }};

  ${(props) => {
    if (props.color) {
      return `color: ${props.color};`;
    }
  }};

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: 8px;
    padding: 1.5px;
    background: linear-gradient(90deg, #9baaf3 0%, #7bd8c0 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  &:not(:disabled):hover {
    background-color: rgba(13, 23, 30, 1);
    background: linear-gradient(90deg, #9baaf3 0%, #7bd8c0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    box-shadow: 0px 8px 16px -4px rgba(126, 213, 197, 0.08),
      0px 8px 24px -4px rgba(154, 173, 241, 0.12);
  }

  &:disabled {
    background-color: rgba(7, 14, 18, 1);
    color: rgba(255, 255, 255, 0.4);
    &:before {
      background: linear-gradient(
        90deg,
        rgba(155, 170, 243, 0.4) 0%,
        rgba(123, 216, 192, 0.4) 100%
      );
    }
  }

  &:focus-visible {
    background-color: rgba(13, 23, 30, 1);
    box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.2);

    span {
      background: linear-gradient(90deg, #9baaf3 0%, #7bd8c0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }
    &:before {
      padding: 2px;
      background: rgba(7, 14, 18, 1);
    }
  }
`;

export const OutlinedWhiteButton = styled(BaseButton)`
  ${tw`relative`}

  ${(props) => {
    if (props.backgroundColor) {
      return `background: ${props.backgroundColor};`;
    }
  }};

  ${(props) => {
    if (props.color) {
      return `color: ${props.color};`;
    }
  }};

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: 8px;
    padding: 1.5px;
    background: rgba(255, 255, 255, 1);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  &:not(:disabled):hover {
    box-shadow: 0px 8px 16px -4px rgba(126, 213, 197, 0.08),
      0px 8px 24px -4px rgba(154, 173, 241, 0.12);
    background-color: rgba(13, 23, 30, 1);
  }

  &:disabled {
    background-color: rgba(7, 14, 18, 1);
    color: rgba(255, 255, 255, 0.4);
    &:before {
      content: '';
      background: rgba(255, 255, 255, 0.4);
    }
  }

  &:focus-visible {
    background-color: rgba(13, 23, 30, 1);
    box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.2);
    &:before {
      padding: 2px;
      background: rgba(7, 14, 18, 1);
    }
  }
`;

export const FilledStylizedButton = styled(BaseButton)`
  ${tw`relative`}
  font-family: 'ClashDisplay-Variable';
  background: linear-gradient(90deg, #9baaf3 0%, #7bd8c0 100%);
  color: rgba(0, 0, 0, 1);
  font-weight: 600;

  ${(props) => {
    if (props.backgroundColor) {
      return `background: ${props.backgroundColor};`;
    }
  }};

  ${(props) => {
    if (props.color) {
      return `color: ${props.color};`;
    }
  }};

  &:not(:disabled):hover {
    box-shadow: 0px 8px 16px -4px rgba(126, 213, 197, 0.08),
      0px 8px 24px -4px rgba(154, 173, 241, 0.12);
  }

  &:disabled {
    color: rgba(7, 14, 18, 1);
    background: linear-gradient(
      90deg,
      rgba(155, 170, 243, 0.4) 0%,
      rgba(123, 216, 192, 0.4) 100%
    );
    box-shadow: none;
  }

  &:focus-visible {
    box-shadow: 0px 0px 0px 2px rgba(7, 14, 18, 1),
      0px 0px 0px 4px rgba(255, 255, 255, 0.2);
  }
`;

export const OutlinedGradientRoundedButton = styled(BaseButton)`
  ${tw`relative`}
  border-radius: 100px;

  ${(props) => {
    if (props.backgroundColor) {
      return `background: ${props.backgroundColor};`;
    }
  }};

  ${(props) => {
    if (props.color) {
      return `color: ${props.color};`;
    }
  }}

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: 100px;
    padding: 1.5px;
    background: linear-gradient(90deg, #9baaf3 0%, #7bd8c0 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  &:not(:disabled):hover {
    background-color: rgba(13, 23, 30, 1);
    background: linear-gradient(90deg, #9baaf3 0%, #7bd8c0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    box-shadow: 0px 8px 16px -4px rgba(126, 213, 197, 0.08),
      0px 8px 24px -4px rgba(154, 173, 241, 0.12);
  }

  &:disabled {
    background-color: rgba(7, 14, 18, 1);
    color: rgba(255, 255, 255, 0.4);
    &:before {
      content: '';
      background: linear-gradient(
        90deg,
        rgba(155, 170, 243, 0.4) 0%,
        rgba(123, 216, 192, 0.4) 100%
      );
    }
  }

  &:focus-visible {
    background-color: rgba(13, 23, 30, 1);
    box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.2);
    span {
      background: linear-gradient(90deg, #9baaf3 0%, #7bd8c0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }
    &:before {
      padding: 1.5px;
      background: rgba(7, 14, 18, 1);
    }
  }
`;

const ButtonWithIconWrapper = styled.div.attrs(
  (props: { svgColorType?: 'fill' | 'stroke' }) => props
)`
  ${tw`relative`}
  width: max-content;

  button:not(:disabled) ~ div {
    path {
      ${(props) => {
        if (props.svgColorType === 'stroke') {
          return `stroke: var(--default-color);`;
        } else if (props.svgColorType === 'fill') {
          return `fill: var(--default-color);`;
        }
      }}
    }
  }

  button:disabled ~ div {
    path {
      ${(props) => {
        if (props.svgColorType === 'stroke') {
          return `stroke: var(--disabled-color);`;
        } else if (props.svgColorType === 'fill') {
          return `fill: var(--disabled-color);`;
        }
      }}
    }
  }

  button:not(:disabled):hover ~ div {
    path {
      ${(props) => {
        if (props.svgColorType === 'stroke') {
          return `stroke: var(--active-color);`;
        } else if (props.svgColorType === 'fill') {
          return `fill: var(--active-color);`;
        }
      }}
    }
  }

  button:focus-visible ~ div {
    path {
      ${(props) => {
        if (props.svgColorType === 'stroke') {
          return `stroke: var(--active-color);`;
        } else if (props.svgColorType === 'fill') {
          return `fill: var(--active-color);`;
        }
      }}
    }
  }
`;

const SVGWrapper = styled.div.attrs(
  (props: {
    size: 'S' | 'M' | 'L';
    position: 'leading' | 'trailing' | 'center';
    color: string;
    disabledColor: string;
    activeColor?: string;
  }) => props
)`
  --default-color: ${(props) => props.color};
  --disabled-color: ${(props) => props.disabledColor};
  --active-color: ${(props) =>
    props.activeColor ? `url(${props.activeColor})` : props.color};
  ${tw`absolute`}
  top: ${(props) => `calc(50% - ${ICON_SIZES[props.size] / 2}px)`};
  pointer-events: none;
  ${(props) => {
    switch (props.position) {
      case 'leading':
        return `left: ${
          ICON_PADDING[props.size] -
          ICON_SIZES[props.size] -
          ICON_SPACING[props.size]
        }px`;
      case 'trailing':
        return `right: ${
          ICON_PADDING[props.size] -
          ICON_SIZES[props.size] -
          ICON_SPACING[props.size]
        }px`;
      case 'center':
        return `left: calc(50% - ${ICON_SIZES[props.size] / 2}px);`;
    }
  }};

  svg {
    width: ${(props) => ICON_SIZES[props.size]}px;
    height: ${(props) => ICON_SIZES[props.size]}px;
  }
`;

export type ButtonWithIconProps = {
  size: 'S' | 'M' | 'L';
  Icon: ReactElement;
  svgColorType: 'fill' | 'stroke';
  activeGradientId?: string /* Needed to have a gradient for the icon when the button is active */;
  position: 'leading' | 'trailing' | 'center';
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  name?: string;
  backgroundColor?: string;
  color?: string;
  fillWidth?: boolean;
};

export function FilledGradientButtonWithIcon(props: ButtonWithIconProps) {
  const {
    size,
    Icon,
    svgColorType,
    position,
    disabled,
    children,
    onClick,
    name,
    backgroundColor,
    color,
    fillWidth,
  } = props;
  return (
    <ButtonWithIconWrapper svgColorType={svgColorType}>
      <FilledGradientButton
        size={size}
        paddingLeft={position === 'leading' ? ICON_PADDING[size] : undefined}
        paddingRight={position === 'trailing' ? ICON_PADDING[size] : undefined}
        empty={!children}
        disabled={disabled}
        onClick={onClick}
        name={name}
        backgroundColor={backgroundColor}
        color={color}
        fillWidth={fillWidth}
      >
        {children}
      </FilledGradientButton>
      <SVGWrapper
        size={props.size}
        position={props.position}
        color={DEFAULT_BLACK}
        disabledColor={DISABLED_BLACK}
      >
        {!!Icon && Icon}
      </SVGWrapper>
    </ButtonWithIconWrapper>
  );
}

export function FilledGreyButtonWithIcon(props: ButtonWithIconProps) {
  const {
    size,
    Icon,
    svgColorType,
    position,
    disabled,
    children,
    onClick,
    name,
    backgroundColor,
    color,
    fillWidth,
  } = props;
  return (
    <ButtonWithIconWrapper svgColorType={svgColorType}>
      <FilledGreyButton
        size={size}
        paddingLeft={position === 'leading' ? ICON_PADDING[size] : undefined}
        paddingRight={position === 'trailing' ? ICON_PADDING[size] : undefined}
        empty={!children}
        disabled={disabled}
        onClick={onClick}
        name={name}
        backgroundColor={backgroundColor}
        color={color}
        fillWidth={fillWidth}
      >
        {children}
      </FilledGreyButton>
      <SVGWrapper
        size={props.size}
        position={props.position}
        color={DEFAULT_WHITE}
        disabledColor={DISABLED_WHITE}
      >
        {!!Icon && Icon}
      </SVGWrapper>
    </ButtonWithIconWrapper>
  );
}

export function OutlinedGradientButtonWithIcon(props: ButtonWithIconProps) {
  const {
    size,
    Icon,
    svgColorType,
    activeGradientId,
    position,
    disabled,
    children,
    onClick,
    name,
    backgroundColor,
    color,
    fillWidth,
  } = props;
  return (
    <ButtonWithIconWrapper svgColorType={svgColorType}>
      <OutlinedGradientButton
        size={size}
        paddingLeft={position === 'leading' ? ICON_PADDING[size] : undefined}
        paddingRight={position === 'trailing' ? ICON_PADDING[size] : undefined}
        empty={!children}
        disabled={disabled}
        onClick={onClick}
        name={name}
        backgroundColor={backgroundColor}
        color={color}
        fillWidth={fillWidth}
      >
        {children}
      </OutlinedGradientButton>
      <SVGWrapper
        size={props.size}
        position={props.position}
        color={DEFAULT_WHITE}
        disabledColor={DISABLED_WHITE}
        activeColor={activeGradientId}
      >
        {!!Icon && Icon}
      </SVGWrapper>
    </ButtonWithIconWrapper>
  );
}

export function OutlinedWhiteButtonWithIcon(props: ButtonWithIconProps) {
  const {
    size,
    Icon,
    svgColorType,
    position,
    disabled,
    children,
    onClick,
    name,
    backgroundColor,
    color,
    fillWidth,
  } = props;
  return (
    <ButtonWithIconWrapper svgColorType={svgColorType}>
      <OutlinedWhiteButton
        size={size}
        paddingLeft={position === 'leading' ? ICON_PADDING[size] : undefined}
        paddingRight={position === 'trailing' ? ICON_PADDING[size] : undefined}
        empty={!children}
        disabled={disabled}
        onClick={onClick}
        name={name}
        backgroundColor={backgroundColor}
        color={color}
        fillWidth={fillWidth}
      >
        {children}
      </OutlinedWhiteButton>
      <SVGWrapper
        size={props.size}
        position={props.position}
        color={DEFAULT_WHITE}
        disabledColor={DISABLED_WHITE}
      >
        {!!Icon && Icon}
      </SVGWrapper>
    </ButtonWithIconWrapper>
  );
}

export function FilledStylizedButtonWithIcon(props: ButtonWithIconProps) {
  const {
    size,
    Icon,
    svgColorType,
    position,
    disabled,
    children,
    onClick,
    name,
    backgroundColor,
    color,
    fillWidth,
  } = props;
  return (
    <ButtonWithIconWrapper svgColorType={svgColorType}>
      <FilledStylizedButton
        size={size}
        paddingLeft={position === 'leading' ? ICON_PADDING[size] : undefined}
        paddingRight={position === 'trailing' ? ICON_PADDING[size] : undefined}
        empty={!children}
        disabled={disabled}
        onClick={onClick}
        name={name}
        backgroundColor={backgroundColor}
        color={color}
        fillWidth={fillWidth}
      >
        {children}
      </FilledStylizedButton>
      <SVGWrapper
        size={props.size}
        position={props.position}
        color={DEFAULT_BLACK}
        disabledColor={DISABLED_BLACK}
      >
        {!!Icon && Icon}
      </SVGWrapper>
    </ButtonWithIconWrapper>
  );
}

export function OutlinedGradientRoundedButtonWithIcon(
  props: ButtonWithIconProps
) {
  const {
    size,
    Icon,
    svgColorType,
    activeGradientId,
    position,
    disabled,
    children,
    onClick,
    name,
    backgroundColor,
    color,
    fillWidth,
  } = props;
  return (
    <ButtonWithIconWrapper svgColorType={svgColorType}>
      <OutlinedGradientRoundedButton
        size={size}
        paddingLeft={position === 'leading' ? ICON_PADDING[size] : undefined}
        paddingRight={position === 'trailing' ? ICON_PADDING[size] : undefined}
        empty={!children}
        disabled={disabled}
        onClick={onClick}
        name={name}
        backgroundColor={backgroundColor}
        color={color}
        fillWidth={fillWidth}
      >
        {children}
      </OutlinedGradientRoundedButton>
      <SVGWrapper
        size={props.size}
        position={props.position}
        color={DEFAULT_WHITE}
        disabledColor={DISABLED_WHITE}
        activeColor={activeGradientId}
      >
        {!!Icon && Icon}
      </SVGWrapper>
    </ButtonWithIconWrapper>
  );
}

export const LinkButton = styled.button`
  ${tw`rounded-md text-purple-500 bg-transparent font-medium disabled:text-[#6447B5]`}

  position: relative;

  // Pseudo-element trick to keep width constant despite font weight changes
  ::before {
    display: block;
    height: 0;
    content: attr(name);
    overflow: hidden;
    visibility: hidden;
    ${tw`font-semibold`}
  }

  :hover:enabled:not(:focus) {
    ${tw`font-semibold text-purple-600`}
  }

  :focus {
    ${tw`font-semibold text-purple-600`}
    box-shadow: none;
    //outline: none;
  }
`;

export const WarningButton = styled.button`
  ${tw`rounded-md text-caution bg-transparent font-medium disabled:text-[#6447B5]`}

  position: relative;

  // Pseudo-element trick to keep width constant despite font weight changes
  ::before {
    display: block;
    height: 0;
    content: attr(name);
    overflow: hidden;
    visibility: hidden;
    ${tw`font-semibold`}
  }

  :hover:enabled:not(:focus) {
    ${tw`font-semibold`}
    color: #ff912e;
  }

  :focus {
    ${tw`font-semibold`}
    box-shadow: none;
    color: #ff912e;
    //outline: none;
  }
`;

const ButtonWithIconWrapperOld = styled.div`
  ${tw`flex flex-row items-center justify-start`}
  position: relative;
  cursor: pointer;
`;

export type ButtonWithIconWrapperOldProps = {
  icon: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  buttonClassName?: string;
  children?: React.ReactNode;
  name?: string;
  disabled?: boolean;
};

export function LinkButtonWithIcon(props: ButtonWithIconWrapperOldProps) {
  return (
    <ButtonWithIconWrapperOld onClick={props.onClick || (() => {})}>
      <img
        src={props.icon}
        alt=''
        className={classNames('w-6 h-6 absolute', props.className || '')}
      />
      <LinkButton
        disabled={props.disabled || false}
        className={classNames('pl-8', props.buttonClassName || '')}
        name={props.name || ''}
      >
        {props.children}
      </LinkButton>
    </ButtonWithIconWrapperOld>
  );
}

export function WarningButtonWithIcon(props: ButtonWithIconWrapperOldProps) {
  return (
    <ButtonWithIconWrapperOld onClick={props.onClick || (() => {})}>
      <img
        src={props.icon}
        alt=''
        className={classNames('w-6 h-6 absolute', props.className || '')}
      />
      <WarningButton
        className={classNames('pl-8', props.buttonClassName || '')}
        name={props.name || ''}
        disabled={props.disabled || false}
      >
        {props.children}
      </WarningButton>
    </ButtonWithIconWrapperOld>
  );
}

const PreviousPageButtonWrapper = styled.button`
  ${tw`flex items-center justify-center`}
  width: 35px;
  height: 35px;
  border-radius: 8px;
  background-color: rgba(26, 41, 52, 1);
`;

const PreviousPageIcon = styled.img`
  width: 19px;
  height: 19px;
`;

export type PreviousPageButtonProps = {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

export function PreviousPageButton(props: PreviousPageButtonProps) {
  const { onClick } = props;
  return (
    <PreviousPageButtonWrapper onClick={onClick}>
      <PreviousPageIcon src={LeftChevron} alt='Previous Page' />
    </PreviousPageButtonWrapper>
  );
}
