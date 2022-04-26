import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import tw from 'twin.macro';
import RightArrow from '../../assets/svg/small_right_arrow.svg';

const CONTAINER_BORDER_GRADIENT = `linear-gradient(90deg, #9BAAF3 0%, #7BD8C0 100%)`;
export const EMPTY_PORTFOLIO_SUB_TEXT_COLOR = 'rgba(75, 105, 128, 1)';
const BROWSE_POOLS_BUTTON_HOVER_SHADOW_COLOR = 'rgba(154, 173, 241, 0.12)';

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
    font-size: 24px;
`;

const EmptyPortfolioSubText = styled.span`
    ${tw`text-center text-white`}
    font-size: 16px;
    color: ${EMPTY_PORTFOLIO_SUB_TEXT_COLOR};
`;

const BrowsePoolsButton = styled.button.attrs((props: {icon: string}) => props)`
    ${tw`flex justify-center items-center text-white`}
    gap: 10px;
    padding: 16px 24px;
    border: 1px solid white;
    border-radius: 8px;
    line-height: 24px;
    &:after {
        content: '';
        display: block;
        width: 24px;
        height: 24px;
        background-image: url(${props => props.icon});
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
    }
    &:hover {
        box-shadow: 0px 8px 24px -4px ${BROWSE_POOLS_BUTTON_HOVER_SHADOW_COLOR};
    }
`;

export default function EmptyPortfolio() {
    return (
        <Container>
            <div className='flex flex-col items-center'>
                <EmptyPortfolioText>Looks like your Aloe portfolio is empty.</EmptyPortfolioText>
                <EmptyPortfolioSubText>Browse our pools or migrate your external positions.</EmptyPortfolioSubText>
            </div>
            <div className='flex flex-col items-center'>
                <BrowsePoolsButton icon={RightArrow} as={NavLink} to='/blend/pools'>Browse Pools</BrowsePoolsButton>
            </div>
        </Container>
    );
}