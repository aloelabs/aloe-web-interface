import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import { ReactComponent as BrowsePoolsIcon } from '../../assets/svg/small_right_arrow.svg';
import { OutlinedWhiteButtonWithIcon } from '../common/Buttons';

export const EMPTY_PORTFOLIO_SUB_TEXT_COLOR = 'rgba(75, 105, 128, 1)';
const CONTAINER_BORDER_GRADIENT = `linear-gradient(90deg, #9BAAF3 0%, #7BD8C0 100%)`;

const Container = styled.div`
  ${tw`flex flex-col items-center justify-evenly`}
  gap: 32px;
  position: relative;
  padding-top: 56px;
  padding-bottom: 56px;
  &:after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: 8px;
    padding: 1.5px;
    background: ${CONTAINER_BORDER_GRADIENT};
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
`;

const EmptyPortfolioText = styled.span`
  ${tw`text-center text-white`}
  font-size: 28px;
  font-weight: 700;
  line-height: 28px;
  padding-bottom: 4px;
`;

const EmptyPortfolioSubText = styled.span`
  ${tw`text-center text-white`}
  font-size: 18px;
  font-weight: 400;
  line-height: 24.3px;
  color: ${EMPTY_PORTFOLIO_SUB_TEXT_COLOR};
`;

export default function EmptyPortfolio() {
  const navigate = useNavigate();
  return (
    <Container>
      <div className='flex flex-col items-center'>
        <EmptyPortfolioText>
          Looks like your Aloe portfolio is empty.
        </EmptyPortfolioText>
        <EmptyPortfolioSubText>
          Browse our pools or migrate your external positions.
        </EmptyPortfolioSubText>
      </div>
      <div className='flex flex-col items-center'>
        <OutlinedWhiteButtonWithIcon
          Icon={<BrowsePoolsIcon />}
          position='trailing'
          size='L'
          activeGradientId='#migrate-icon-gradient'
          svgColorType='stroke'
          onClick={() => {
            navigate('/#/blend/pools');
          }}
        >
          <span>Browse Pools</span>
        </OutlinedWhiteButtonWithIcon>
      </div>
    </Container>
  );
}
