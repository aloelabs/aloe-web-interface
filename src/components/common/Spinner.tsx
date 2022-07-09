import React from 'react';
import styled from 'styled-components';

const ALT_SPINNER_SIZES = {
  S: 30,
  M: 50,
  L: 70,
};

const IOS_STYLE_SPINNER_SIZES = {
  S: 0.5,
  M: 0.75,
  L: 1,
};

export const AltSpinner = styled.div.attrs(
  (props: { size?: 'S' | 'M' | 'L' }) => props
)`
  --size: ${(props) => ALT_SPINNER_SIZES[props.size || 'L']}px;
  --offset: ${(props) => ALT_SPINNER_SIZES[props.size || 'L'] / 2}px;
  position: absolute;
  width: var(--size);
  height: var(--size);
  top: calc(50% - var(--offset));
  left: calc(50% - var(--offset));
  border-radius: 50%;
  border-top: 5px solid #63b59a;
  border-right: 5px solid transparent;
  animation: alt-spin 1s linear infinite;

  @keyframes alt-spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;

const IOSStyleSpinnerWrapper = styled.div.attrs(
  (props: { size: 'S' | 'M' | 'L' }) => props
)`
  span {
    --translate-y: ${(props) =>
      `calc(-30px * ${IOS_STYLE_SPINNER_SIZES[props.size]})`};
    --width: ${(props) => `calc(8px * ${IOS_STYLE_SPINNER_SIZES[props.size]})`};
    --height: ${(props) =>
      `calc(20px * ${IOS_STYLE_SPINNER_SIZES[props.size]})`};
    --offset-left: ${(props) =>
      `calc(50% - calc(8px / 2 * ${IOS_STYLE_SPINNER_SIZES[props.size]}))`};
    --offset-top: ${(props) =>
      `calc(50% - calc(20px / 2 * ${IOS_STYLE_SPINNER_SIZES[props.size]}))`};
    display: block;
    position: absolute;
    left: var(--offset-left);
    top: var(--offset-top);
    width: var(--width);
    height: var(--height);
    background: #fff;
    border-radius: 4px;

    &:nth-child(1) {
      transform: rotate(0deg) translateY(var(--translate-y));
      animation: spin 1.2s infinite linear;
      animation-delay: 0s;
    }

    &:nth-child(2) {
      transform: rotate(30deg) translateY(var(--translate-y));
      animation: spin 1.2s infinite linear;
      animation-delay: -1.1s;
    }

    &:nth-child(3) {
      transform: rotate(60deg) translateY(var(--translate-y));
      animation: spin 1.2s infinite linear;
      animation-delay: -1s;
    }

    &:nth-child(4) {
      transform: rotate(90deg) translateY(var(--translate-y));
      animation: spin 1.2s infinite linear;
      animation-delay: -0.9s;
    }

    &:nth-child(5) {
      transform: rotate(120deg) translateY(var(--translate-y));
      animation: spin 1.2s infinite linear;
      animation-delay: -0.8s;
    }

    &:nth-child(6) {
      transform: rotate(150deg) translateY(var(--translate-y));
      animation: spin 1.2s infinite linear;
      animation-delay: -0.7s;
    }

    &:nth-child(7) {
      transform: rotate(180deg) translateY(var(--translate-y));
      animation: spin 1.2s infinite linear;
      animation-delay: -0.6s;
    }

    &:nth-child(8) {
      transform: rotate(210deg) translateY(var(--translate-y));
      animation: spin 1.2s infinite linear;
      animation-delay: -0.5s;
    }

    &:nth-child(9) {
      transform: rotate(240deg) translateY(var(--translate-y));
      animation: spin 1.2s infinite linear;
      animation-delay: -0.4s;
    }

    &:nth-child(10) {
      transform: rotate(270deg) translateY(var(--translate-y));
      animation: spin 1.2s infinite linear;
      animation-delay: -0.3s;
    }

    &:nth-child(11) {
      transform: rotate(300deg) translateY(var(--translate-y));
      animation: spin 1.2s infinite linear;
      animation-delay: -0.2s;
    }

    &:nth-child(12) {
      transform: rotate(330deg) translateY(var(--translate-y));
      animation: spin 1.2s infinite linear;
      animation-delay: -0.1s;
    }
  }

  @keyframes spin {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0.25;
    }
  }
`;

export type IOSStyleSpinnerProps = {
  size?: 'S' | 'M' | 'L';
};

export function IOSStyleSpinner(props: IOSStyleSpinnerProps) {
  return (
    <IOSStyleSpinnerWrapper size={props.size || 'L'}>
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} />
      ))}
    </IOSStyleSpinnerWrapper>
  );
}
