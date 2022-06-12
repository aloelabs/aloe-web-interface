import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { EMPTY_PORTFOLIO_SUB_TEXT_COLOR } from './EmptyPortfolio';
import ExternalPortfolioCardSkeleton from './ExternalPortfolioCardSkeleton';

const CONTAINER_BORDER_COLOR = `rgba(43, 64, 80, 1)`;

const Container = styled.div`
  ${tw`flex flex-col items-center justify-evenly`}
  gap: 32px;
  position: relative;
  padding: 40px;
  border: 1.5px dashed ${CONTAINER_BORDER_COLOR};
  border-radius: 8px;
`;

const EmptyExternalPortfolioText = styled.span`
  ${tw`text-center text-white`}
  font-size: 28px;
  font-weight: 700;
  line-height: 28px;
  padding-bottom: 4px;
`;

const EmptyExternalPortfolioSubText = styled.span`
  ${tw`text-center text-white`}
  font-size: 18px;
  font-weight: 400;
  line-height: 24.3px;
  color: ${EMPTY_PORTFOLIO_SUB_TEXT_COLOR};
`;

export default function EmptyExternalPortfolio() {
  return (
    <Container>
      <div className='flex flex-col items-center'>
        <EmptyExternalPortfolioText>
          Your external positions will appear here.
        </EmptyExternalPortfolioText>
        <EmptyExternalPortfolioSubText>
          Aloe allows you to import your existing external positions with just
          one click.
        </EmptyExternalPortfolioSubText>
      </div>
      <ExternalPortfolioCardSkeleton />
    </Container>
  );
}
