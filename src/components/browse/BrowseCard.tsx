import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import { BlendPoolMarkers, PrintFeeTier } from '../../data/BlendPoolMarkers';
import { GetSiloData } from '../../data/SiloData';
import { GetTokenData } from '../../data/TokenData';
import { prominent } from 'color.js';
import {
  BROWSE_CARD_WIDTH_LG,
  BROWSE_CARD_WIDTH_MD,
  BROWSE_CARD_WIDTH_XL,
  RESPONSIVE_BREAKPOINT_LG,
  RESPONSIVE_BREAKPOINT_MD,
} from '../../data/constants/Breakpoints';
import InvestedTypes from '../common/InvestedTypes';

const CARD_BODY_BG_COLOR = 'rgba(13, 23, 30, 1)';
const FEE_TIER_BG_COLOR = 'rgba(26, 41, 52, 1)';
const FEE_TIER_TEXT_COLOR = 'rgba(204, 223, 237, 1)';
const FEE_TIER_OUTLINE_COLOR = 'rgba(13, 23, 30, 1)';
const TOKEN_PAIR_FIGURE_COLOR = 'rgba(43, 64, 80, 1);';
const BODY_DIVIDER_BG_COLOR = 'rgba(26, 41, 52, 1)';
const INFO_CATEGORY_TEXT_COLOR = 'rgba(130, 160, 182, 1)';

const CardWrapper = styled(NavLink).attrs(
  (props: { border: string; shadow: string }) => props
)`
  ${tw`flex flex-col items-start justify-evenly`}
  width: ${BROWSE_CARD_WIDTH_XL};
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  &:hover {
    box-shadow: 0px 8px 48px 0px ${(props) => props.shadow};
    &:before {
      content: '';
      position: absolute;
      inset: 0;
      pointer-events: none;
      border-radius: 8px;
      padding: 1.5px;
      background: ${(props) => props.border};
      -webkit-mask: linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
  }
  @media (max-width: ${RESPONSIVE_BREAKPOINT_LG}) {
    width: ${BROWSE_CARD_WIDTH_LG};
  }
  @media (max-width: ${RESPONSIVE_BREAKPOINT_MD}) {
    width: ${BROWSE_CARD_WIDTH_MD};
    margin: 0 auto;
  }
`;

const CardTitleWrapper = styled.div.attrs(
  (props: { gradient: string }) => props
)`
  ${tw`flex flex-col items-start justify-start`}
  padding: 32px 32px 40px 32px;
  position: relative;
  background: ${(props) => props.gradient};
  width: 100%;
`;

const CardSubTitleWrapper = styled.div`
  ${tw`flex flex-row items-center justify-between`}
  position: absolute;
  left: 0;
  bottom: -18px;
  width: calc(100% - 72px);
  height: 36px;
  margin-left: 40px;
  margin-right: 32px;
`;

const TokenIconsWrapper = styled.div`
  ${tw`flex flex-row items-center justify-start -space-x-2`}
`;

const TokenIcon = styled.img`
  ${tw`w-8 h-8 rounded-full bg-white`}
  box-shadow: 0 0 0 3px black;
`;

const FeeTierContainer = styled.div`
  ${tw`flex flex-col items-center justify-center`}
  line-height: 20px;
  padding: 8px 16px;
  background: ${FEE_TIER_BG_COLOR};
  color: ${FEE_TIER_TEXT_COLOR};
  outline: 2px solid ${FEE_TIER_OUTLINE_COLOR};
  border-radius: 100px;
`;

const CardBodyWrapper = styled.div`
  ${tw`flex flex-col items-start justify-start`}
  width: 100%;
  padding: 42px 32px 24px 32px;
  gap: 24px;
  background: ${CARD_BODY_BG_COLOR};
`;

const BodySubContainer = styled.div`
  ${tw`flex flex-row items-center justify-between`}
  width: 100%;
  gap: 16px;
`;

const ResponsiveBodySubContainer = styled(BodySubContainer)`
  @media (max-width: ${RESPONSIVE_BREAKPOINT_MD}) {
    flex-direction: column;
    justify-content: start;
    align-items: start;
  }
`;

const BodyDivider = styled.div`
  width: 100%;
  height: 1px;
  background: ${BODY_DIVIDER_BG_COLOR};
`;

const InfoCategoryContainer = styled.div`
  ${tw`flex flex-col justify-between`}
  gap: 4px;
`;

const InfoCategory = styled.span`
  ${tw`text-sm`}
  color: ${INFO_CATEGORY_TEXT_COLOR};
`;

// My simple solution to determining the prominent color of the icon
// (Uses external library)
// Feel free to replace this with something more robust if need be
const getProminentColor = async (path: string) => {
  const values = await prominent(path, { amount: 1 });
  return `${values[0]}, ${values[1]}, ${values[2]}`;
};

const rgb = (color: string) => {
  return `rgb(${color})`;
};

const rgba = (color: string, alpha: number) => {
  return `rgba(${color}, ${alpha})`;
};

// Very naive logic to get the brighter color used to pick which color to
// use for the shadow
const getBrighterColor = (color0: string, color1: string) => {
  const values0 = color0.split(',').map((v) => parseInt(v.trim()));
  const values1 = color1.split(',').map((v) => parseInt(v.trim()));
  const avg0 = (values0[0] + values0[1] + values0[2]) / 3;
  const avg1 = (values1[0] + values1[1] + values1[2]) / 3;
  return avg0 > avg1 ? color0 : color1;
};

export type BrowseCardProps = {
  blendPoolMarkers: BlendPoolMarkers;
};

export default function BrowseCard(props: BrowseCardProps) {
  const { blendPoolMarkers } = props;
  const link = `/blend/pool/${blendPoolMarkers.poolAddress}`;
  const token0 = GetTokenData(
    blendPoolMarkers.token0Address.toLocaleLowerCase()
  );
  const token1 = GetTokenData(
    blendPoolMarkers.token1Address.toLocaleLowerCase()
  );
  const silo0 = GetSiloData(blendPoolMarkers.silo0Address.toLocaleLowerCase());
  const silo1 = GetSiloData(blendPoolMarkers.silo1Address.toLocaleLowerCase());
  const feeTier = PrintFeeTier(blendPoolMarkers.feeTier);

  /**
   * Placeholders until we have the actual data
   */
  const pricePerShare = 729.48;
  const aprFee = '10%';
  const totalValueLocked = '$379M';

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
    <CardWrapper to={link} border={cardBorderGradient} shadow={cardShadowColor}>
      <CardTitleWrapper gradient={cardTitleBackgroundGradient}>
        <span className='text-2xl font-bold'>
          {token0.ticker}-{token1.ticker}
        </span>
        <CardSubTitleWrapper>
          <TokenIconsWrapper>
            <TokenIcon src={token0.iconPath} alt='' />
            <TokenIcon src={token1.iconPath} alt='' />
          </TokenIconsWrapper>
          <FeeTierContainer>Uniswap Fee Tier - {feeTier}</FeeTierContainer>
        </CardSubTitleWrapper>
      </CardTitleWrapper>
      <CardBodyWrapper>
        <BodySubContainer>
          <span>Invest your</span>
          <InvestedTypes token0={token0} token1={token1} silo0={silo0} silo1={silo1} figureColor={TOKEN_PAIR_FIGURE_COLOR} shouldGrow={true} />
        </BodySubContainer>
        <BodyDivider />
        <ResponsiveBodySubContainer>
          <InfoCategoryContainer>
            <InfoCategory>Price per Share</InfoCategory>
            <span className='text-2xl'>
              ${pricePerShare.toLocaleString('en-US')} USD
            </span>
          </InfoCategoryContainer>
          <InfoCategoryContainer>
            <InfoCategory>APR Fee</InfoCategory>
            <span className='text-2xl'>{aprFee}</span>
          </InfoCategoryContainer>
          <InfoCategoryContainer>
            <InfoCategory>TVL</InfoCategory>
            <span className='text-2xl'>{totalValueLocked}</span>
          </InfoCategoryContainer>
        </ResponsiveBodySubContainer>
      </CardBodyWrapper>
    </CardWrapper>
  );
}
