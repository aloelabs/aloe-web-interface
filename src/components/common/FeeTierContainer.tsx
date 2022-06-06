import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { FeeTier, PrintFeeTier } from '../../data/BlendPoolMarkers';
import { Text } from './Typography';

const FEE_TIER_TEXT_COLOR = 'rgba(204, 223, 237, 1)';

const Wrapper = styled.div`
  ${tw`flex flex-col items-center justify-center`}
  padding: 8px 16px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
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
      <Text size='S' weight='medium' color={FEE_TIER_TEXT_COLOR}>
        Uniswap Fee Tier - {PrintFeeTier(feeTier)}
      </Text>
    </Wrapper>
  );
}
