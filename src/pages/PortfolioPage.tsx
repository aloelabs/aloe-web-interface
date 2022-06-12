import React from 'react';
import AppPage from '../components/common/AppPage';
import styled from 'styled-components';
import tw from 'twin.macro';
import PortfolioCard from '../components/portfolio/PortfolioCard';
import EmptyPortfolio from '../components/portfolio/EmptyPortfolio';
import InfoIcon from '../assets/svg/info.svg';
import ExternalPortfolioCard from '../components/portfolio/ExternalPortfolioCard';
import EmptyExternalPortfolio from '../components/portfolio/EmptyExternalPortfolio';
import { GetTokenData } from '../data/TokenData';
import { FeeTier } from '../data/BlendPoolMarkers';
import { GetSiloData } from '../data/SiloData';
import { Text } from '../components/common/Typography';

const PORTFOLIO_TITLE_TEXT_COLOR = 'rgba(130, 160, 182, 1)';

const Container = styled.div`
  ${tw`flex flex-col items-center justify-evenly`}
  gap: 64px;
`;

const PortfolioCards = styled.div`
  ${tw`flex flex-wrap justify-center items-center`}
  gap: 24px;
  margin-top: 24px;
`;

const InfoButton = styled.button.attrs((props: { icon: string }) => props)`
  ${tw`flex justify-center items-center`}
  gap: 10px;
  color: rgba(130, 160, 182, 1);
  border-radius: 8px;
  line-height: 30px;
  font-size: 18px;
  &:after {
    content: '';
    display: block;
    width: 24px;
    height: 24px;
    background-image: url(${(props) => props.icon});
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
`;

export default function PortfolioPage() {
  return (
    <AppPage>
      <Container>
        <div className='w-full'>
          <EmptyPortfolio />
        </div>
        <div className='w-full'>
          <Text size='XL' weight='medium' color={PORTFOLIO_TITLE_TEXT_COLOR}>
            Your Portfolio
          </Text>
          <PortfolioCards>
            <PortfolioCard
              token0={GetTokenData(
                '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
              )}
              token1={GetTokenData(
                '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
              )}
              silo0={GetSiloData('0x723bfe564661536fdffa3e9e060135928d3bf18f')}
              silo1={GetSiloData('0x8f43969d04ba8aaec7c69813a07a276189c574d2')}
              uniswapFeeTier={FeeTier.ZERO_THREE}
              estimatedValue={1930.48}
              percentageChange={2}
            />
            <PortfolioCard
              token0={GetTokenData(
                '0x03ab458634910aad20ef5f1c8ee96f1d6ac54919'
              )}
              token1={GetTokenData(
                '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
              )}
              silo0={GetSiloData('0xf70fc6b694d911b1f665b754f77ec5e83d340594')}
              silo1={GetSiloData('0x8f43969d04ba8aaec7c69813a07a276189c574d2')}
              uniswapFeeTier={FeeTier.ZERO_THREE}
              estimatedValue={1930.48}
              percentageChange={-1}
            />
            <PortfolioCard
              token0={GetTokenData(
                '0x956f47f50a910163d8bf957cf5846d573e7f87ca'
              )}
              token1={GetTokenData(
                '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b'
              )}
              silo0={GetSiloData('0x0770d239e56d96bc1e049b94949b0a0199b77cf6')}
              silo1={GetSiloData('0x2a9855dc8afa59e6067287b8aa15cd009938d137')}
              uniswapFeeTier={FeeTier.ZERO_THREE}
              estimatedValue={1930.48}
              percentageChange={-1}
            />
            <PortfolioCard
              token0={GetTokenData(
                '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
              )}
              token1={GetTokenData(
                '0xf4d2888d29d722226fafa5d9b24f9164c092421e'
              )}
              silo0={GetSiloData('0x0a230cca01f7107933d5355913e9a65082f37c52')}
              silo1={GetSiloData('0x7a17db19e5bfe3e96d6a8da9c100ac86a4650d54')}
              uniswapFeeTier={FeeTier.ZERO_THREE}
              estimatedValue={1930.48}
              percentageChange={-1}
            />
          </PortfolioCards>
        </div>
        <div className='w-full'>
          <div className='flex justify-between items-center'>
            <Text size='XL' weight='medium' color={PORTFOLIO_TITLE_TEXT_COLOR}>
              Your External Positions
            </Text>
            <InfoButton icon={InfoIcon}>What is this?</InfoButton>
          </div>
          <PortfolioCards>
            <ExternalPortfolioCard
              token0={GetTokenData(
                '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
              )}
              token1={GetTokenData(
                '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
              )}
              uniswapFeeTier={FeeTier.ZERO_THREE}
              estimatedValue={1930.48}
              percentageChange={2}
            />
            <ExternalPortfolioCard
              token0={GetTokenData(
                '0x03ab458634910aad20ef5f1c8ee96f1d6ac54919'
              )}
              token1={GetTokenData(
                '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
              )}
              uniswapFeeTier={FeeTier.ZERO_THREE}
              estimatedValue={1930.48}
              percentageChange={-1}
            />
          </PortfolioCards>
        </div>
        <div className='w-full'>
          <EmptyExternalPortfolio />
        </div>
      </Container>
    </AppPage>
  );
}
