import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { SiloData } from '../../data/SiloData';
import { TokenData } from '../../data/TokenData';

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

const TokenTicker = styled.span`
  ${tw`text-white`}
  font-size: 32px;
  font-weight: 600;
  line-height: 40px;
  font-family: 'ClashDisplay-Variable';
`;

const SiloName = styled.span`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: rgba(236, 247, 255, 1);
`;

export type TokenPairHeaderProps = {
  token0: TokenData;
  token1: TokenData;
  silo0: SiloData;
  silo1: SiloData;
};

export default function TokenPairHeader(props: TokenPairHeaderProps) {
  return (
    <div className='flex items-center gap-4'>
      <TokenIconsWrapper>
        <TokenIcon src={props.token0.iconPath} alt={props.token0.name} />
        <TokenIcon src={props.token1.iconPath} alt={props.token1.name} />
      </TokenIconsWrapper>
      <div className='flex justify-center items-center gap-4'>
        <div className='flex flex-col'>
          <TokenTicker>{props.token0.ticker}</TokenTicker>
          <SiloName>via {props.silo0.shortName}</SiloName>
        </div>
        <Dash />
        <div className='flex flex-col'>
          <TokenTicker>{props.token1.ticker}</TokenTicker>
          <SiloName>via {props.silo1.shortName}</SiloName>
        </div>
      </div>
    </div>
  );
}
