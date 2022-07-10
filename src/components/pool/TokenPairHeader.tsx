import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { RESPONSIVE_BREAKPOINT_SM } from '../../data/constants/Breakpoints';
import { SiloData } from '../../data/SiloData';
import { TokenData } from '../../data/TokenData';
import FeeTierContainer from '../common/FeeTierContainer';
import { Display, Text } from '../common/Typography';

const SILO_TEXT_COLOR = 'rgba(236, 247, 255, 1)';

const TokenPairContainer = styled.div`
  ${tw`flex items-center relative`}
  column-gap: 16px;
  flex-direction: row;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    width: max-content;
    flex-direction: column;
    row-gap: 8px;
  }
`;

const AbsoluteFeeTierContainer = styled(FeeTierContainer)`
  position: absolute;
  top: 76px;
  left: 0px;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    width: 170px;
    top: 132px;
    left: calc(50% - 85px);
  }
`;

const TokenIconsWrapper = styled.div`
  ${tw`flex flex-row items-center justify-start -space-x-4`}
  width: 80px;
  height: 48px;
`;

const TokenIcon = styled.img`
  ${tw`rounded-full bg-white`}
  box-shadow: 0 0 0 3px black;
  width: 48px;
  height: 48px;
`;

const Dash = styled.div`
  ${tw`bg-white`}
  width: 13.43px;
  height: 4.64px;
`;

export type TokenPairHeaderProps = {
  token0: TokenData;
  token1: TokenData;
  silo0: SiloData;
  silo1: SiloData;
  feeTier: number;
};

export default function TokenPairHeader(props: TokenPairHeaderProps) {
  return (
    <TokenPairContainer>
      <>
        <TokenIconsWrapper>
          <TokenIcon src={props.token0.iconPath} alt={props.token0.name} />
          <TokenIcon src={props.token1.iconPath} alt={props.token1.name} />
        </TokenIconsWrapper>
        <div className='flex justify-center items-center gap-4'>
          <div className='flex flex-col'>
            <Display size='L' weight='semibold'>{props.token0.ticker}</Display>
            <Text size='S' weight='medium' color={SILO_TEXT_COLOR}>via {props.silo0.shortName}</Text>
          </div>
          <Dash />
          <div className='flex flex-col'>
            <Display size='L' weight='semibold'>{props.token1.ticker}</Display>
            <Text size='S' weight='medium' color={SILO_TEXT_COLOR}>via {props.silo1.shortName}</Text>
          </div>
        </div>
        <AbsoluteFeeTierContainer feeTier={props.feeTier} />
      </>
    </TokenPairContainer>
  );
}
