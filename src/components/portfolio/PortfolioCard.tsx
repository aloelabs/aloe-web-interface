import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { FeeTier } from '../../data/BlendPoolMarkers';
import {
  RESPONSIVE_BREAKPOINT_MD,
  RESPONSIVE_BREAKPOINT_SM,
} from '../../data/constants/Breakpoints';
import { SiloData } from '../../data/SiloData';
import { TokenData } from '../../data/TokenData';
import {
  getBrighterColor,
  getProminentColor,
  rgb,
  rgba,
} from '../../util/Colors';
import FeeTierContainer from '../common/FeeTierContainer';
import InvestedTypes from '../common/InvestedTypes';
import TokenPairIcons from '../common/TokenPairIcons';
import { PercentChange } from '../common/PercentChange';
import { Display, Text } from '../common/Typography';
import { formatUSDAuto } from '../../util/Numbers';

const CARD_BODY_BG_COLOR = 'rgba(13, 23, 30, 1)';
const TOKEN_PAIR_FIGURE_COLOR = 'rgba(255, 255, 255, 0.6)';
const TOKEN_ICON_BORDER_COLOR = 'rgba(0, 0, 0, 1)';
const SILO_TEXT_COLOR = 'rgba(228, 237, 246, 1)';
const BODY_DIVIDER_BG_COLOR = 'rgba(255, 255, 255, 0.1)';

export const CardWrapper = styled.div.attrs(
  (props: { borderGradient: string; shadowColor: string }) => props
)`
  display: grid;
  grid-template-columns: 89fr 159fr;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  position: relative;

  &:hover {
    box-shadow: 0px 8px 48px 0px ${(props) => props.shadowColor};
    &:before {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: 8px;
      padding: 1.5px;
      background: ${(props) => props.borderGradient};
      -webkit-mask: linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
  }

  @media (max-width: ${RESPONSIVE_BREAKPOINT_MD}) {
    grid-template-columns: 1fr;
  }
`;

export const CardTitleWrapper = styled.div.attrs(
  (props: { backgroundGradient: string }) => props
)`
  ${tw`flex flex-col items-start justify-center`}
  padding: 32px;
  gap: 18px;
  background: ${(props) => props.backgroundGradient};
  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    padding: 32px 16px;
  }
`;

export const CardSubTitleWrapper = styled.div`
  ${tw`flex flex-row items-center`}
  gap: 16px;
  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    flex-direction: column;
    align-items: start;
  }
`;

export const CardBodyWrapper = styled.div`
  display: flex;
  align-items: center;
  background: ${CARD_BODY_BG_COLOR};
  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const TokenPairTickers = styled.div`
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  font-family: 'ClashDisplay-Variable';
`;

export const TokenIconsWrapper = styled.div`
  ${tw`flex flex-row items-center justify-start -space-x-2`}
  width: 56px;
  height: 32px;
`;

export const TokenIcon = styled.img`
  ${tw`rounded-full bg-white`}
  position: relative;
  width: 32px;
  height: 32px;
  box-shadow: 0 0 0 3px ${TOKEN_ICON_BORDER_COLOR};
`;

const BodySubContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: calc(50% - 0.5px);
  padding-left: 40px;
  padding-right: 48px;
  height: 88px;
  @media (max-width: ${RESPONSIVE_BREAKPOINT_MD}) {
    padding: 20px 32px;
    height: auto;
  }
  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    width: 100%;
  }
`;

const BodyDivider = styled.div`
  width: 1px;
  height: 88px;
  background-color: ${BODY_DIVIDER_BG_COLOR};
  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    width: 100%;
    height: 1px;
  }
`;

export const TokenTickerText = styled.span`
  font-size: 16px;
  line-height: 24px;
`;

export const SiloText = styled.span`
  font-size: 14px;
  line-height: 20px;
  color: ${SILO_TEXT_COLOR};
`;

export const ValueText = styled.span`
  font-size: 32px;
  font-weight: 700;
`;

export type PortfolioCardProps = {
  token0: TokenData;
  token1: TokenData;
  silo0: SiloData;
  silo1: SiloData;
  uniswapFeeTier: FeeTier;
  estimatedValue: number;
  percentageChange: number;
};

export default function PortfolioCard(props: PortfolioCardProps) {
  const {
    token0,
    token1,
    silo0,
    silo1,
    uniswapFeeTier,
    estimatedValue,
    percentageChange,
  } = props;
  const [token0Color, setToken0Color] = useState<string>('');
  const [token1Color, setToken1Color] = useState<string>('');
  useEffect(() => {
    let mounted = true;
    getProminentColor(token0.iconPath || '').then((color) => {
      if (mounted) {
        setToken0Color(color);
      }
    });
    getProminentColor(token1.iconPath || '').then((color) => {
      if (mounted) {
        setToken1Color(color);
      }
    });
    return () => {
      mounted = false;
    };
  });
  // Create the variables for the gradients.
  const cardTitleBackgroundGradient = `linear-gradient(90deg, ${rgba(
    token0Color,
    0.25
  )} 0%, ${rgba(token1Color, 0.25)} 100%)`;
  const cardBorderGradient = `linear-gradient(90deg, ${rgb(
    token0Color
  )} 0%, ${rgb(token1Color)} 100%)`;
  const cardShadowColor = rgba(
    getBrighterColor(token0Color, token1Color),
    0.16
  );
  return (
    <CardWrapper
      borderGradient={cardBorderGradient}
      shadowColor={cardShadowColor}
    >
      <CardTitleWrapper backgroundGradient={cardTitleBackgroundGradient}>
        <Display size='M' weight='semibold'>
          {token0.ticker} - {token1.ticker}
        </Display>
        <CardSubTitleWrapper>
          <TokenPairIcons
            token0IconPath={token0.iconPath}
            token1IconPath={token1.iconPath}
            token0AltText={`${token0.name}'s Icon`}
            token1AltText={`${token1.name}'s Icon`}
          />
          <FeeTierContainer feeTier={uniswapFeeTier} />
        </CardSubTitleWrapper>
      </CardTitleWrapper>
      <CardBodyWrapper>
        <BodySubContainer>
          <Text size='M' weight='medium'>Invested</Text>
          <InvestedTypes
            token0={token0}
            token1={token1}
            silo0={silo0}
            silo1={silo1}
            figureColor={TOKEN_PAIR_FIGURE_COLOR}
          />
        </BodySubContainer>
        <BodyDivider />
        <BodySubContainer>
          <Text size='M' weight='medium'>
            Estimated Value
          </Text>
          <div className='flex gap-2 items-center'>
            <ValueText>{formatUSDAuto(estimatedValue)}</ValueText>
            <PercentChange percent={percentageChange} />
          </div>
        </BodySubContainer>
      </CardBodyWrapper>
    </CardWrapper>
  );
}
