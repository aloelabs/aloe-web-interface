import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { roundPercentage } from '../../util/Numbers';
import PositiveChangeIcon from '../../assets/svg/positive_change_chevron.svg';
import NegativeChangeIcon from '../../assets/svg/negative_change_chevron.svg';
import { TokenData } from '../../data/TokenData';
import { FeeTier, PrintFeeTier } from '../../data/BlendPoolMarkers';
import { SiloData } from '../../data/SiloData';
import {
  getBrighterColor,
  getProminentColor,
  rgb,
  rgba,
} from '../../util/Colors';
import {
  RESPONSIVE_BREAKPOINT_SM,
  RESPONSIVE_BREAKPOINT_MD,
} from '../../data/constants/Breakpoints';
import InvestedTypes from '../common/InvestedTypes';
import TokenPairIcons from '../common/TokenPairIcons';

const CARD_BODY_BG_COLOR = 'rgba(13, 23, 30, 1)';
const TOKEN_PAIR_FIGURE_COLOR = 'rgba(255, 255, 255, 0.6)';
const BODY_DIVIDER_BG_COLOR = 'rgba(255, 255, 255, 0.1)';
const FEE_TIER_BG_COLOR = 'rgba(255, 255, 255, 0.1)';
const FEE_TIER_TEXT_COLOR = 'rgba(204, 223, 237, 1)';
const POSITIVE_PERCENT_BG_COLOR = 'rgba(0, 193, 67, 0.1)';
const POSITIVE_PERCENT_TEXT_COLOR = 'rgb(0, 193, 67)';
const NEGATIVE_PERCENT_BG_COLOR = 'rgba(255, 255, 255, 0.1)';
const NEGATIVE_PERCENT_TEXT_COLOR = 'rgba(130, 160, 182, 1)';
const PERCENT_ROUNDING_PRECISION = 2;

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

export const FeeTierContainer = styled.div`
  ${tw`flex flex-col items-center justify-center`}
  padding: 8px 16px;
  background: ${FEE_TIER_BG_COLOR};
  color: ${FEE_TIER_TEXT_COLOR};
  border-radius: 100px;
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

export const ValueText = styled.span`
  font-size: 32px;
`;

const PercentChangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  border-radius: 8px;
  padding: 6px;
  font-size: 12px;
  &:after {
    content: '';
    width: 14px;
    height: 14px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
`;

export const PositivePercentChangeContainer = styled(PercentChangeContainer)`
  background: ${POSITIVE_PERCENT_BG_COLOR};
  color: ${POSITIVE_PERCENT_TEXT_COLOR};
  &:after {
    background-image: url(${PositiveChangeIcon});
  }
`;

export const NegativePercentChangeContainer = styled(PercentChangeContainer)`
  background: ${NEGATIVE_PERCENT_BG_COLOR};
  color: ${NEGATIVE_PERCENT_TEXT_COLOR};
  &:after {
    background-image: url(${NegativeChangeIcon});
  }
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
    /**
     * Add whatever async logic needed to calculate the gradients.
     */
    getProminentColor(token0.iconPath || '').then((color) => {
      setToken0Color(color);
    });
    getProminentColor(token1.iconPath || '').then((color) => {
      setToken1Color(color);
    });
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
        <span className='text-2xl font-bold'>
          {token0.ticker} - {token1.ticker}
        </span>
        <CardSubTitleWrapper>
          <TokenPairIcons
            token0IconPath={token0.iconPath}
            token1IconPath={token1.iconPath}
            token0AltText={`${token0.name}'s Icon`}
            token1AltText={`${token1.name}'s Icon`}
          />
          <FeeTierContainer>
            Uniswap Fee Tier - {PrintFeeTier(uniswapFeeTier)}
          </FeeTierContainer>
        </CardSubTitleWrapper>
      </CardTitleWrapper>
      <CardBodyWrapper>
        <BodySubContainer>
          <span>Invested</span>
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
          <span>Estimated Value</span>
          <div className='flex gap-2 items-center'>
            <ValueText>${estimatedValue.toLocaleString('en-US')}</ValueText>
            {percentageChange >= 0 && (
              <PositivePercentChangeContainer>
                +{roundPercentage(percentageChange, PERCENT_ROUNDING_PRECISION)}
                %
              </PositivePercentChangeContainer>
            )}
            {percentageChange < 0 && (
              <NegativePercentChangeContainer>
                {roundPercentage(percentageChange, PERCENT_ROUNDING_PRECISION)}%
              </NegativePercentChangeContainer>
            )}
          </div>
        </BodySubContainer>
      </CardBodyWrapper>
    </CardWrapper>
  );
}
