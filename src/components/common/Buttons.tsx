import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { classNames } from '../../util/ClassNames';
import MigrateIcon from '../../assets/svg/migrate.svg';
import LeftChevron from '../../assets/svg/left_chevron.svg';

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

export const MigrateButton = styled.button`
  display: inline-flex;
  position: relative;
  width: fit-content;
  gap: 14.7px;
  padding: 16px 24px;
  line-height: 24px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 700;
  line-height: 24.3px;
  user-select: none;
  cursor: pointer;
  &:before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    padding: 1.5px;
    background: linear-gradient(90deg, #9baaf3 0%, #7bd8c0 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    border-radius: 8px;
  }
  &:hover {
    box-shadow: 0px 8px 16px -4px rgba(126, 213, 197, 0.08),
      0px 8px 24px -4px rgba(154, 173, 241, 0.12);
  }
  &:after {
    content: '';
    width: 24px;
    height: 24px;
    background-image: url(${MigrateIcon});
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
`;

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

const ButtonWithIconWrapper = styled.div`
  ${tw`flex flex-row items-center justify-start`}
  position: relative;
  cursor: pointer;
`;

export type ButtonWithIconProps = {
  icon: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  buttonClassName?: string;
  children?: React.ReactNode;
  name?: string;
  disabled?: boolean;
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
