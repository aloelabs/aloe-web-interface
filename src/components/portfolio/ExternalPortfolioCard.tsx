import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { ReactComponent as MigrateIcon } from '../../assets/svg/migrate.svg';
import { FeeTier } from '../../data/BlendPoolMarkers';
import {
  RESPONSIVE_BREAKPOINT_MD,
  RESPONSIVE_BREAKPOINT_SM
} from '../../data/constants/Breakpoints';
import { TokenData } from '../../data/TokenData';
import { OutlinedGradientButtonWithIcon } from '../common/Buttons';
import FeeTierContainer from '../common/FeeTierContainer';
import { PercentChange } from '../common/PercentChange';
import TokenPairIcons from '../common/TokenPairIcons';
import { Display, Text } from '../common/Typography';
import {
  CardBodyWrapper,
  CardSubTitleWrapper,
  CardTitleWrapper,
  CardWrapper,
  ValueText
} from './PortfolioCard';

const EXTERNAL_CARD_WRAPPER_HOVER_SHADOW_COLOR = 'rgba(26, 41, 52, 0.65)';
const EXTERNAL_CARD_WRAPPER_HOVER_OUTLINE_COLOR = 'rgba(56, 82, 101, 1)';
const CARD_TITLE_BG_COLOR = 'rgba(26, 41, 52, 0.5)';

const ExternalCardWrapper = styled(CardWrapper)`
  &:hover {
    box-shadow: 0px 8px 48px 0px ${EXTERNAL_CARD_WRAPPER_HOVER_SHADOW_COLOR};
    outline: 1px solid ${EXTERNAL_CARD_WRAPPER_HOVER_OUTLINE_COLOR};
  }
`;

const BodySubContainer = styled.div`
  ${tw`flex flex-col justify-between`}
  width: 50%;
  height: 88px;
  padding-left: 40px;
  padding-right: 48px;
  @media (max-width: ${RESPONSIVE_BREAKPOINT_MD}) {
    padding: 20px 32px;
    height: auto;
  }
  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    width: 100%;
  }
`;

export const ValuePercentContainer = styled.div`
  ${tw`flex gap-2 items-center`}
`;

const EndAlignedBodySubContainer = styled(BodySubContainer)`
  ${tw`justify-center items-end`}
  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    align-items: start;
  }
`;

export type ExternalPortfolioCardProps = {
  token0: TokenData;
  token1: TokenData;
  uniswapFeeTier: FeeTier;
  estimatedValue: number;
  percentageChange: number;
};

export default function ExternalPortfolioCard(
  props: ExternalPortfolioCardProps
) {
  const { token0, token1, uniswapFeeTier, estimatedValue, percentageChange } =
    props;
  return (
    <ExternalCardWrapper>
      <CardTitleWrapper backgroundGradient={CARD_TITLE_BG_COLOR}>
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
          <Text size='M' weight='medium'>
            Estimated Value
          </Text>
          <ValuePercentContainer>
            <ValueText>${estimatedValue.toLocaleString('en-US')}</ValueText>
            <PercentChange percent={percentageChange} />
          </ValuePercentContainer>
        </BodySubContainer>
        <EndAlignedBodySubContainer>
          <OutlinedGradientButtonWithIcon
            Icon={<MigrateIcon />}
            position='trailing'
            size='L'
            activeGradientId='#migrate-icon-gradient'
            svgColorType='fill'
          >
            <span>Migrate to Aloe</span>
          </OutlinedGradientButtonWithIcon>
        </EndAlignedBodySubContainer>
      </CardBodyWrapper>
    </ExternalCardWrapper>
  );
}
