import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { classNames } from '../../util/ClassNames';

type SiloBlobProps = {
  width?: string;
  className?: string;
  color?: string;
  expand?: boolean;
  children?: React.ReactNode;
};

const Diamond = styled.div<{ color: string }>`
  --size: 6px;
  --color: ${({ color }) => color};
  width: 0;
  height: 0;
  border: var(--size) solid transparent;
  border-bottom-color: var(--color);
  position: relative;
  top: calc(-1 * var(--size));
  ::after {
    content: '';
    position: absolute;
    left: calc(-1 * var(--size));
    top: var(--size);
    width: 0;
    height: 0;
    border: var(--size) solid transparent;
    border-top-color: var(--color);
  }
`;

const Line = styled.div<{ width: string; color: string; expand: boolean }>`
  ${({ expand, width }) => {
    if (expand) {
      return 'width: 100%;\nflex-grow: 1;';
    } else {
      return `width: ${width};`;
    }
  }}
  --height: 2px;
  --color: ${({ color }) => color};
  background-color: var(--color);
  height: var(--height);
  position: relative;
  ::after {
    content: '';
    position: absolute;
    left: calc(-1 * var(--height));
    top: 0px;
    width: var(--height);
    height: var(--height);
    background: var(--color);
  }
`;

const SiloNameBubble = styled.div<{ color: string }>`
  ${tw`flex flex-row items-center justify-center`}
  background-color: ${({ color }) => color};
  border-radius: 15px;
  padding: 4px 15px;
  height: 30px;
  width: -moz-fit-content;
  width: fit-content;
  white-space: nowrap;
`;

export default function SiloBlob(props: SiloBlobProps) {
  const color = props.color || '#3E5A6F';
  const expand = props.expand || false;

  return (
    <div className={props.className}>
      <div
        className={classNames(
          'flex flex-row items-center justify-start',
          expand ? 'grow' : ''
        )}
      >
        <Diamond color={color} />
        <Line color={color} width={props.width || '15px;'} expand={expand} />
        <SiloNameBubble color={color}>{props.children}</SiloNameBubble>
      </div>
    </div>
  );
}
