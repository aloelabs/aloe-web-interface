import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import {
  BlendPoolMarkers,
  PrintFeeTier,
} from '../../data/BlendPoolMarkers';
import {
  BROWSE_CARD_WIDTH_LG,
  BROWSE_CARD_WIDTH_MD,
  BROWSE_CARD_WIDTH_XL,
  RESPONSIVE_BREAKPOINT_LG,
  RESPONSIVE_BREAKPOINT_MD,
  RESPONSIVE_BREAKPOINT_SM,
} from '../../data/constants/Breakpoints';
import { API_URL } from '../../data/constants/Values';
import { OffChainPoolStats } from '../../data/PoolStats';
import { GetSiloData } from '../../data/SiloData';
import { GetTokenData } from '../../data/TokenData';
import {
  getBrighterColor,
  getProminentColor,
  rgb,
  rgba,
} from '../../util/Colors';
import InvestedTypes from '../common/InvestedTypes';
import TokenPairIcons from '../common/TokenPairIcons';
import {
  formatUSDAuto,
  roundPercentage,
} from '../../util/Numbers';
import { Display, Text } from '../common/Typography';
import { theGraphUniswapV3Client } from '../../App';
import { getUniswapVolumeQuery } from '../../util/GraphQL';

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
  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    width: 100%;
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

const FeeTierContainer = styled.div`
  ${tw`flex flex-col items-center justify-center`}
  line-height: 20px;
  padding: 8px 16px;
  background: ${FEE_TIER_BG_COLOR};
  color: ${FEE_TIER_TEXT_COLOR};
  box-shadow: 0px 0px 0px 2px ${FEE_TIER_OUTLINE_COLOR};
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

export type BrowseCardProps = {
  blendPoolMarkers: BlendPoolMarkers;
  blockNumber: string | null;
};

export default function BrowseCard(props: BrowseCardProps) {
  const { blendPoolMarkers, blockNumber } = props;
  const [uniswapVolume, setUniswapVolume] = useState<number | null>(null);
  const [poolStats, setPoolStats] = useState<OffChainPoolStats>();
  const [token0Color, setToken0Color] = useState<string>('');
  const [token1Color, setToken1Color] = useState<string>('');

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

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      const uniswapVolumeQuery = getUniswapVolumeQuery(blockNumber, token0.address, token1.address, blendPoolMarkers.feeTier);
      const uniswapVolumeData = await theGraphUniswapV3Client.query({ query: uniswapVolumeQuery});

      if (mounted) {
        setUniswapVolume(
          uniswapVolumeData['data'] ?
            uniswapVolumeData['data']['curr'][0]['volumeUSD'] - uniswapVolumeData['data']['prev'][0]['volumeUSD'] :
            null
        );
      }
    };
    if (blockNumber && token0.address && token1.address && blendPoolMarkers.feeTier) {
      fetchData();
    }
    return () => {
      mounted = false;
    };
  }, [blendPoolMarkers.feeTier, blockNumber, token0.address, token1.address]);

  useEffect(() => {
    let mounted = true;
    const fetchPoolStats = async () => {
      const poolStatsResponse = await axios.get(
        `${API_URL}/pool_stats/${blendPoolMarkers.poolAddress}/1`
      );
      const poolStatsData = poolStatsResponse.data[0] as OffChainPoolStats;
      if (mounted && poolStatsData) {
        setPoolStats(poolStatsData);
      }
    };
    fetchPoolStats();
    return () => {
      mounted = false;
    };
  }, [blendPoolMarkers.poolAddress]);

  // TODO: Move this to a utility function
  useEffect(() => {
    let mounted = true;
    const calculateProminentColors = async () => {
      const token0Color = await getProminentColor(token0.iconPath || '');
      const token1Color = await getProminentColor(token1.iconPath || '');
      if (mounted) {
        setToken0Color(token0Color);
        setToken1Color(token1Color);
      }
    };
    calculateProminentColors();
    return () => {
      mounted = false;
    };
  }, [token0, token1]);

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
        <Display size='M' weight='semibold'>
          {token0.ticker}-{token1.ticker}
        </Display>
        <CardSubTitleWrapper>
          <TokenPairIcons
            token0IconPath={token0.iconPath}
            token1IconPath={token1.iconPath}
            token0AltText={`${token0.name}'s Icon`}
            token1AltText={`${token1.name}'s Icon`}
          />
          <FeeTierContainer>
            <Text size='S' weight='medium'>
              Uniswap Fee Tier - {feeTier}
            </Text>
          </FeeTierContainer>
        </CardSubTitleWrapper>
      </CardTitleWrapper>
      <CardBodyWrapper>
        <BodySubContainer>
          <Text size='M' weight='medium'>
            Invest your
          </Text>
          <InvestedTypes
            token0={token0}
            token1={token1}
            silo0={silo0}
            silo1={silo1}
            figureColor={TOKEN_PAIR_FIGURE_COLOR}
            shouldGrow={true}
          />
        </BodySubContainer>
        <BodyDivider />
        <ResponsiveBodySubContainer>
          <InfoCategoryContainer>
            <Text size='S' weight='medium' color={INFO_CATEGORY_TEXT_COLOR}>
              24H Uniswap Volume
            </Text>
            <Text size='XL' weight='medium'>
              {formatUSDAuto(uniswapVolume)}
            </Text>
          </InfoCategoryContainer>
          <InfoCategoryContainer>
            <Text size='S' weight='medium' color={INFO_CATEGORY_TEXT_COLOR}>
              APR (14d avg)
            </Text>
            <Text size='XL' weight='medium'>
              {roundPercentage(100 * (poolStats?.annual_percentage_rate ?? 0))}%
            </Text>
          </InfoCategoryContainer>
          <InfoCategoryContainer>
            <Text size='S' weight='medium' color={INFO_CATEGORY_TEXT_COLOR}>
              TVL
            </Text>
            <Text size='XL' weight='medium'>
              {formatUSDAuto(poolStats?.total_value_locked || 0)}
            </Text>
          </InfoCategoryContainer>
        </ResponsiveBodySubContainer>
      </CardBodyWrapper>
    </CardWrapper>
  );
}
