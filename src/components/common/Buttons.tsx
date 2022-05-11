import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { classNames } from '../../util/ClassNames';

export const PrimaryButton = styled.button`
  ${tw`rounded-md text-grey-0 font-medium`}

  // Pseudo-element trick to keep width constant despite font weight changes
  ::before {
    display: block;
    height: 0;
    content: attr(name);
    overflow: hidden;
    visibility: hidden;
    ${tw`font-semibold`}
  }

  background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0) 93.74%,
      rgba(0, 0, 0, 0.25) 93.75%
    ),
    linear-gradient(99.84deg, #c08fff -54.16%, #6ccfe4 44.69%, #88e2a1 134.83%);

  :hover:enabled {
    ${tw`font-semibold`}
    box-shadow: 0px 6px 16px rgba(68, 240, 239, 0.2);
  }

  :focus {
    background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.25),
        rgba(255, 255, 255, 0.25)
      ),
      linear-gradient(
        180deg,
        rgba(0, 0, 0, 0) 93.74%,
        rgba(0, 0, 0, 0.25) 93.75%
      ),
      linear-gradient(
        99.84deg,
        #c08fff -54.16%,
        #6ccfe4 44.69%,
        #88e2a1 134.83%
      );
    outline: none;
    box-shadow: inset 0 0 0 2px white;
  }

  :disabled {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25)),
      linear-gradient(
        180deg,
        rgba(0, 0, 0, 0) 93.74%,
        rgba(0, 0, 0, 0.25) 93.75%
      ),
      linear-gradient(
        99.84deg,
        #c08fff -54.16%,
        #6ccfe4 44.69%,
        #88e2a1 134.83%
      );
  }
`;

export const SecondaryButton = styled.button`
  ${tw`rounded-md text-grey-1000 bg-grey-300 font-medium disabled:text-grey-600`}

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

  :focus::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    ${tw`rounded-md p-0.5`}
    background:linear-gradient(100.16deg, #BA85FF -1.68%, #64CCE3 53.09%, #80E09B 103.03%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  :hover:enabled {
    ${tw`font-semibold bg-grey-500`}
    box-shadow: 0px 6px 16px 0px #44F0EF1F;
  }

  :focus {
    ${tw`font-semibold`}
    outline: none;
    box-shadow: none;
  }

  :focus:not(:hover) {
    ${tw`bg-grey-400`}
  }
`;

export const TertiaryButton = styled.button`
  ${tw`rounded-md text-grey-1000 bg-transparent font-medium disabled:text-grey-500`}

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

  ::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    ${tw`rounded-md p-0.5`}
    background: linear-gradient(100.16deg, #BA85FF -1.68%, #64CCE3 53.09%, #80E09B 103.03%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  :disabled::after {
    background: linear-gradient(
        100.16deg,
        #ba85ff -1.68%,
        #64cce3 53.09%,
        #80e09b 103.03%
      ),
      linear-gradient(0deg, rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.25));
  }

  :hover:enabled:not(:focus) {
    ${tw`font-semibold`}
    background: linear-gradient(100.12deg, rgba(159, 84, 255, 0.1) -34.33%, rgba(57, 190, 219, 0.1) 60.51%, rgba(89, 214, 124, 0.1) 117.32%);
    box-shadow: 0px 6px 16px 0px #44f0ef1f;
  }

  :focus {
    ${tw`font-semibold`}
    background: linear-gradient(100.12deg, rgba(159, 84, 255, 0.32) -34.33%, rgba(57, 190, 219, 0.32) 60.51%, rgba(89, 214, 124, 0.32) 117.32%);
    box-shadow: 0px 6px 16px rgba(68, 240, 239, 0.12);
    outline: none;
  }
`;

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

export const OutlinedGradientButton = styled.button.attrs(
  (props: { rounded?: boolean }) => props
)`
  ${(props) => props.rounded ? 'border-radius: 100px;' : 'border-radius: 8px;'}
  padding: 16px 24px;
  overflow: hidden;
  position: relative;
  line-height: 24px;
  font-weight: 700;
  color: #FFFFFF;

  & ~ img {
    display: block;
  }

  & ~ img.gradient {
    display: none;
  }

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    ${(props) => props.rounded ? 'border-radius: 100px;' : 'border-radius: 8px;'}
    padding: 2px;
    background: linear-gradient(90deg, #9baaf3 0%, #7bd8c0 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }

  &:hover {
    box-shadow: 0px 8px 16px -4px rgba(126, 213, 197, 0.08),
    0px 8px 24px -4px rgba(154, 173, 241, 0.12);
    background-color: rgba(13, 23, 30, 1);

    background: linear-gradient(90deg, #9BAAF3 0%, #7BD8C0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;

    & ~ img {
      display: none;
    }

    & ~ img.gradient {
      display: block;
    }
  }

  &:focus {
    box-shadow: 0px 0px 0px 2px rgba(255, 255, 255, 0.2);
    outline: none;
    background-color: rgba(13, 23, 30, 1);

    background: linear-gradient(90deg, #9BAAF3 0%, #7BD8C0 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
    
    &:before {
      background: rgba(7, 14, 18, 1);
    }

    & ~ img {
      display: none;
    }

    & ~ img.gradient {
      display: block;
    }
  }

  &:disabled {
    opacity: 0.4;
    background: transparent;
    -webkit-background-clip: none;
    -webkit-text-fill-color: #FFFFFF;
    background-clip: none;
    text-fill-color: #FFFFFF;

    & ~ img {
      opacity: 0.4;
      display: block;
    }
    & ~ img.gradient {
      display: none;
    }
  }

  &.trailing {
    padding-right: 60px;
  }
`;

const TrailingIcon = styled.img`
  position: absolute;
  right: 24px;
  pointer-events: none;
`;

const ButtonWithIconWrapper = styled.div`
  ${tw`flex flex-row items-center justify-start`}
  position: relative;
  cursor: pointer;
`;

export type ButtonWithIconProps = {
  icon: string;
  gradientIcon?: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  buttonClassName?: string;
  children?: React.ReactNode;
  name?: string;
  disabled?: boolean;
  rounded?: boolean;
};

export function LinkButtonWithIcon(props: ButtonWithIconProps) {
  return (
    <ButtonWithIconWrapper onClick={props.onClick || (() => {})}>
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
    </ButtonWithIconWrapper>
  );
}

export function WarningButtonWithIcon(props: ButtonWithIconProps) {
  return (
    <ButtonWithIconWrapper onClick={props.onClick || (() => {})}>
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
    </ButtonWithIconWrapper>
  );
}

export function PrimaryButtonWithIcon(props: ButtonWithIconProps) {
  return (
    <ButtonWithIconWrapper onClick={props.onClick || (() => {})}>
      <img
        src={props.icon}
        alt=''
        className={classNames('w-6 h-6 absolute', props.className || '')}
      />
      <PrimaryButton
        className={classNames('pl-8', props.buttonClassName || '')}
        name={props.name || ''}
        disabled={props.disabled || false}
      >
        {props.children}
      </PrimaryButton>
    </ButtonWithIconWrapper>
  );
}

export function SecondaryButtonWithIcon(props: ButtonWithIconProps) {
  return (
    <ButtonWithIconWrapper onClick={props.onClick || (() => {})}>
      <img
        src={props.icon}
        alt=''
        className={classNames('w-6 h-6 absolute z-10', props.className || '')}
      />
      <SecondaryButton
        className={classNames('pl-8', props.buttonClassName || '')}
        name={props.name || ''}
        disabled={props.disabled || false}
      >
        {props.children}
      </SecondaryButton>
    </ButtonWithIconWrapper>
  );
}

export function OutlinedGradientButtonWithTrailingIcon(props: ButtonWithIconProps) {
  return (
    <ButtonWithIconWrapper onClick={props.onClick || (() => {})}>
      <OutlinedGradientButton rounded={props.rounded || false} className='trailing'>
        {props.children}
      </OutlinedGradientButton>
      <TrailingIcon
        src={props.icon}
        alt=''
        className={classNames('w-6 h-6 absolute', props.className || '')}
      />
      <TrailingIcon
        src={props.gradientIcon || props.icon}
        alt=''
        className={classNames('w-6 h-6 absolute gradient', props.className || '')}
      />
    </ButtonWithIconWrapper>
  );
}
