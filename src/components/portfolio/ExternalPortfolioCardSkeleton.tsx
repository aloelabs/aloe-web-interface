import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { ValuePercentContainer } from './ExternalPortfolioCard';
import {
  CardBodyWrapper,
  CardTitleWrapper,
  CardWrapper,
  CardSubTitleWrapper,
} from './PortfolioCard';
import { PositivePercentChangeContainer } from '../common/PercentChange';
import {
  RESPONSIVE_BREAKPOINT_SM,
  RESPONSIVE_BREAKPOINT_MD,
} from '../../data/constants/Breakpoints';
import TokenPairIcons from '../common/TokenPairIcons';

const SKELETON_BG_COLOR = 'rgba(43, 64, 80, 1)';
const CARD_TITLE_SKELETON_BG_COLOR = 'rgba(26, 41, 52, 1)';
const TOKEN_ICON_SKELETON_BORDER_COLOR = 'rgba(26, 41, 52, 1)';
const TOKEN_SKELETON_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAOElEQVR42u3OAQ0AMAgAoJvnJYxg/zJaw01IQPysfguFmJiYmJiYmJiYmJiYmJiYmJiYmJjYvdgAy45BwxmPiQIAAAAASUVORK5CYII=';

const BodySubContainer = styled.div`
  ${tw`flex flex-col justify-between`}
  width: 50%;
  height: 88px;
  padding-left: 40px;
  padding-right: 48px;
  @media (max-width: ${RESPONSIVE_BREAKPOINT_MD}) {
    gap: 8px;
    padding: 20px 32px;
    height: auto;
  }
  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    width: 100%;
  }
`;

const EndAlignedBodySubContainer = styled(BodySubContainer)`
  ${tw`justify-center items-end`}
  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    align-items: start;
  }
`;

const TokenTextSkeleton = styled.div`
  width: 96px;
  height: 30px;
  background-color: ${SKELETON_BG_COLOR};
  border-radius: 8px;
`;

const FeeTierContainerSkeleton = styled.div`
  width: 204px;
  height: 35px;
  border: 1px solid ${SKELETON_BG_COLOR};
  border-radius: 8px;
`;

const EstimatedValueTextSkeleton = styled.div`
  width: 100px;
  height: 18px;
  background-color: ${SKELETON_BG_COLOR};
  border-radius: 8px;
`;

const ValueTextSkeleton = styled.div`
  width: 148px;
  height: 43px;
  background-color: ${SKELETON_BG_COLOR};
  border-radius: 8px;
`;

const MigrateButtonSkeleton = styled.div`
  width: 180px;
  height: 56px;
  background-color: ${SKELETON_BG_COLOR};
  border-radius: 8px;
`;

export default function ExternalPortfolioCardSkeleton() {
  return (
    <CardWrapper shadowColor='transparent'>
      <CardTitleWrapper backgroundGradient={CARD_TITLE_SKELETON_BG_COLOR}>
        <div className='flex gap-2'>
          <TokenTextSkeleton /> <TokenTextSkeleton />
        </div>
        <CardSubTitleWrapper>
          <TokenPairIcons
            token0IconPath={TOKEN_SKELETON_URL}
            token1IconPath={TOKEN_SKELETON_URL}
            iconBorderColor={TOKEN_ICON_SKELETON_BORDER_COLOR}
            omitBackground={true}
          />
          <FeeTierContainerSkeleton />
        </CardSubTitleWrapper>
      </CardTitleWrapper>
      <CardBodyWrapper>
        <BodySubContainer>
          <EstimatedValueTextSkeleton />
          <ValuePercentContainer>
            <ValueTextSkeleton />
            <PositivePercentChangeContainer />
          </ValuePercentContainer>
        </BodySubContainer>
        <EndAlignedBodySubContainer>
          <MigrateButtonSkeleton />
        </EndAlignedBodySubContainer>
      </CardBodyWrapper>
    </CardWrapper>
  );
}
