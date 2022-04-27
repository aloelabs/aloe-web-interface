import { prominent } from 'color.js';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import { BlendPoolMarkers, PrintFeeTier } from '../../data/BlendPoolMarkers';
import { GetSiloData } from '../../data/SiloData';
import { GetTokenData } from '../../data/TokenData';

const TOKEN_SKELETON_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAOElEQVR42u3OAQ0AMAgAoJvnJYxg/zJaw01IQPysfguFmJiYmJiYmJiYmJiYmJiYmJiYmJjYvdgAy45BwxmPiQIAAAAASUVORK5CYII=';

const CardWrapper = styled(NavLink).attrs((props: { border: string, shadow: string }) => props)`
  ${tw`flex flex-col items-start justify-evenly`}
  width: 580px;
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
`;

const CardHeader = styled.div.attrs((props: { gradient: string }) => props)`
  ${tw`flex flex-col items-start justify-start`}
  padding: 32px 32px 40px 32px;
  position: relative;
  background: ${(props) => props.gradient};
  width: 100%;
`;

const CardHeaderLower = styled.div`
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

const FeeContainer = styled.div`
  line-height: 20px;
  padding: 8px 16px;
  background: rgba(26, 41, 52, 1);
  outline: 2px solid rgba(13, 23, 30, 1);
  border-radius: 100px;
`;

const CardBody = styled.div`
  ${tw`flex flex-col items-start justify-start`}
  width: 100%;
  padding: 42px 32px 24px 32px;
  gap: 24px;
  background: rgba(13, 23, 30, 1);
`;

const BodySubContainer = styled.div`
  ${tw`flex flex-row items-center justify-between`}
  width: 100%;
  gap: 16px;
`;

const InvestedTypesContainer = styled.div`
  ${tw`flex flex-col`}
  flex-grow: 1;
  gap: 8px;
`;

const InvestedType = styled.div`
  display: flex;
  align-items: center;
  padding-left: 24px;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    left: 0px;
    top: calc(50% - 4px);
    width: 8px;
    height: 8px;
    border-radius: 100%;
    background: rgba(43, 64, 80, 1);
  }
  &:first-child::after {
    content: '';
    position: absolute;
    left: 3px;
    top: 16px;
    width: 2px;
    height: 24px;
    background: rgba(43, 64, 80, 1);
  }
`;

const DashedDivider = styled.div`
  margin-left: 8px;
  margin-right: 8px;
  position: relative;
  flex-grow: 1;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: calc(50% - 1px);
    width: 100%;
    height: 1px;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.6);
  }
`;

const BodyDivider = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(26, 41, 52, 1);
`;

const InfoCategoryContainer = styled.div`
  ${tw`flex flex-col justify-between`}
  gap: 4px;
`;

const InfoCategory = styled.span`
  ${tw`text-sm`}
  color: rgba(130, 160, 182, 1);
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
  blendPoolMarkers: BlendPoolMarkers
};

export default function BrowseCard(props: BrowseCardProps) {
  const { blendPoolMarkers } = props;
  const link = `/blend/pool/${blendPoolMarkers.poolAddress}`;
  const token0 = GetTokenData(blendPoolMarkers.token0Address.toLocaleLowerCase());
  const token1 = GetTokenData(blendPoolMarkers.token1Address.toLocaleLowerCase());
  const silo0 = GetSiloData(blendPoolMarkers.silo0Address.toLocaleLowerCase());
  const silo1 = GetSiloData(blendPoolMarkers.silo1Address.toLocaleLowerCase());
  const feeTier = PrintFeeTier(blendPoolMarkers.feeTier);
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
  return(
    <CardWrapper to={link} border={cardBorderGradient} shadow={cardShadowColor}>
      <CardHeader gradient={cardTitleBackgroundGradient}>
        <span className='text-2xl font-bold'>
          {token0.ticker}-{token1.ticker}
        </span>
        <CardHeaderLower>
          <TokenIconsWrapper>
            <TokenIcon src={token0.iconPath} alt='' />
            <TokenIcon src={token1.iconPath} alt='' />
          </TokenIconsWrapper>
          <FeeContainer>
            Uniswap Fee Tier - {feeTier}
          </FeeContainer>
        </CardHeaderLower>
      </CardHeader>
      <CardBody>
        <BodySubContainer>
            <span>Invest your</span>
            <InvestedTypesContainer>
              <InvestedType>
                <span>{token0.ticker}</span>
                <DashedDivider />
                <span className='text-xs'>{silo0.shortName}</span>
              </InvestedType>
              <InvestedType>
                <span>{token1.ticker}</span>
                <DashedDivider />
                <span className='text-xs'>{silo1.shortName}</span>
              </InvestedType>
            </InvestedTypesContainer>
        </BodySubContainer>
        <BodyDivider />
        <BodySubContainer>
          <InfoCategoryContainer>
            <InfoCategory>Price per Share</InfoCategory>
            <span className='text-2xl'>$729.48 USD</span>
          </InfoCategoryContainer>
          <InfoCategoryContainer>
            <InfoCategory>APR Fee</InfoCategory>
            <span className='text-2xl'>10%</span>
          </InfoCategoryContainer>
          <InfoCategoryContainer>
            <InfoCategory>TVL</InfoCategory>
            <span className='text-2xl'>$379M</span>
          </InfoCategoryContainer>
        </BodySubContainer>
      </CardBody>
    </CardWrapper>
  );
}