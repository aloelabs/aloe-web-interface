import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { FeeTier, PrintFeeTier } from '../../data/BlendPoolMarkers';

const Wrapper = styled.div`
  ${tw`flex flex-col items-center justify-center`}
  padding: 8px 16px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(204, 223, 237, 1);
  border-radius: 100px;
`;

export type FeeTierProps = {
  feeTier: FeeTier;
  className?: string;
};

export default function FeeTierContainer(props: FeeTierProps) {
  const { feeTier, className } = props;
  return (
    <Wrapper className={className}>
      <span>Uniswap Fee Tier - {PrintFeeTier(feeTier)}</span>
    </Wrapper>
  );
}
