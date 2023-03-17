import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import AppPage from '../components/common/AppPage';
import styled from 'styled-components';
import tw from 'twin.macro';
import PortfolioCard from '../components/portfolio/PortfolioCard';
import EmptyPortfolio from '../components/portfolio/EmptyPortfolio';
import ExternalPortfolioCard from '../components/portfolio/ExternalPortfolioCard';
import EmptyExternalPortfolio from '../components/portfolio/EmptyExternalPortfolio';
import { GetTokenData } from '../data/TokenData';
import { BlendPoolMarkers } from '../data/BlendPoolMarkers';
import { GetSiloData } from '../data/SiloData';
import { Text } from '../components/common/Typography';
import PortfolioGraph from '../components/graph/PortfolioGraph';
import Tooltip from '../components/common/Tooltip';
import useMediaQuery from '../data/hooks/UseMediaQuery';
import { RESPONSIVE_BREAKPOINTS } from '../data/constants/Breakpoints';
import axios, { AxiosResponse } from 'axios';
import rateLimit from 'axios-rate-limit';
import { BlendTableContext } from '../data/context/BlendTableContext';
import { theGraphUniswapV2Client } from '../App';
import { UniswapPairValueQuery } from '../util/GraphQL';
import { API_URL } from '../data/constants/Values';
import { PortfolioCardPlaceholder } from '../components/portfolio/PortfolioCardPlaceholder';
import { ExternalPortfolioCardPlaceholder } from '../components/portfolio/ExternalPortfolioCardPlaceholder';
import { useAccount } from 'wagmi';
import { ApolloQueryResult } from '@apollo/react-hooks';
import { poolToUniswapV2Pair } from '../util/Addresses';

const http = rateLimit(axios.create(), {
  maxRequests: 2,
  perMilliseconds: 1000,
  maxRPS: 2,
});

type EtherscanBalanceResponse = {
  balance: number;
  error: boolean;
};

type UniswapV2PositionResponse = {
  pair: {
    reserveUSD: string;
    totalSupply: string;
    __typename: string;
  }
};

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

type Position = {
  pool: BlendPoolMarkers;
  estimatedValue: number;
};

type ExternalPosition = Position & {
  externalPositionName: string;
};

// const aloeAddress = '0x2b6dbde60278f19c742bd6861aa39e0a565f5aa3'//'0xcf2b7c6bc98bfe0d6138a25a3b6162b51f75e05d';
// const externalAddress = '0xfae511813cc7a823f95bbc8bfd9aa3c31e6cc52a';
export type PortfolioPageProps = {
}; 
export default function PortfolioPage() {
  const {address} = useAccount();
  const [positionsLoading, setPositionsLoading] = useState(true);
  const [externalPositionsLoading, setExternalPositionsLoading] =
    useState(true);
  const [positions, setPositions] = useState<Position[]>([]);
  const [externalPositions, setExternalPositions] = useState<ExternalPosition[]>([]);
  const isGTMediumScreen = useMediaQuery(RESPONSIVE_BREAKPOINTS.MD);

  const { poolDataMap } = useContext(BlendTableContext);

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    }
  }, []);

  const loadData = useCallback(async () => {
    let poolData = Array.from(poolDataMap.values()) as BlendPoolMarkers[];
    if (!address || poolData.length === 0) {
      return;
    }
    try {
      const shareBalancesResponse = await http.get(
        `${API_URL}/share_balances/${address}/1/1d/${(
          new Date().getTime() / 1000
        ).toFixed(0)}`
      );
      const positionRequests = Object.entries(shareBalancesResponse.data).map(
        async (entry: any) => {
          return {
            pool: poolDataMap.get(entry[0]) as BlendPoolMarkers,
            balance: entry[1][entry[1].length - 1].balance,
            poolReturns: await axios.get(
              `${API_URL}/pool_returns/${entry[0]}/1/1d/${(
                new Date().getTime() / 1000
              ).toFixed(0)}`
            ),
            poolStats: await axios.get(`${API_URL}/pool_stats/${entry[0]}/1`),
          };
        }
      );
      const positionResponses = await Promise.all(positionRequests);
      const positionsData = positionResponses.map((positionResponse) => {
        const pool = positionResponse.pool;
        const balance = positionResponse.balance;
        const totalSupply =
          positionResponse.poolReturns.data[positionResponse.poolReturns.data.length - 1]
            .total_supply;
        const totalValueLocked = positionResponse.poolStats.data[0].total_value_locked;
        const estimatedValue = (balance / totalSupply) * totalValueLocked;
        return {
          pool,
          estimatedValue,
        };
      });
      if (mounted.current) {
        setPositions(positionsData);
        setPositionsLoading(false);
      }
    } catch (e) {
      console.log(e);
      if (mounted.current) {
        setPositionsLoading(false);
      }
    }

    try {
      const uniswapPositionRequests = poolData.map(async (pool) => {
        const pairAddress = poolToUniswapV2Pair(pool.poolAddress);
        return {
          pool: pool,
          etherscanData: await http.get(
            `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${pairAddress}&address=${address}&tag=latest&apikey=F7XAB91MQBBZ1HSCUEI343VVP7CTASW4N1`,
            {
              transformResponse: (response) => {
                const responseJSON = JSON.parse(response);
                return {
                  balance: isNaN(responseJSON.result) ? 0 : parseInt(responseJSON.result),
                  error: responseJSON.message !== '1',
                } as EtherscanBalanceResponse;
              }
            },
          ) as AxiosResponse<EtherscanBalanceResponse, any>,
          uniswapData: await theGraphUniswapV2Client.query({
            query: UniswapPairValueQuery,
            variables: {
              pairAddress: pairAddress,
            },
          }) as ApolloQueryResult<UniswapV2PositionResponse>,
        };
      });
      const uniswapPositionResponse = await Promise.all(uniswapPositionRequests);
      const nonZeroUniswapPositions = uniswapPositionResponse.filter((uniswapPosition) => {
        return uniswapPosition.etherscanData.data.balance > 0;
      });
      const uniswapPositionData = nonZeroUniswapPositions.map((nonZeroUniswapPosition) => {
        const userBalance = nonZeroUniswapPosition.etherscanData.data.balance / 10 ** 18;
        const pairTotalSupply = parseFloat(nonZeroUniswapPosition.uniswapData.data.pair.totalSupply);
        const pairValue = parseFloat(nonZeroUniswapPosition.uniswapData.data.pair.reserveUSD);
        return {
          pool: nonZeroUniswapPosition.pool,
          estimatedValue: (userBalance * pairValue) / pairTotalSupply,
          externalPositionName: 'Uniswap V2',
        };
      });
      if (mounted.current) {
        setExternalPositions(uniswapPositionData);
        setExternalPositionsLoading(false);
      }
    } catch (e) {
      console.log(e);
      if (mounted.current) {
        setExternalPositionsLoading(false);
      }
    }
  }, [address, poolDataMap]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <AppPage>
      <Container>
        <div className='w-full'>
          <PortfolioGraph accountAddress={address ?? null} />
        </div>
        <div className='w-full max-w-[1280px]'>
          <Text size='XL' weight='medium' color={PORTFOLIO_TITLE_TEXT_COLOR}>
            Your Portfolio
          </Text>
          {(positionsLoading || positions.length > 0) && (
            <PortfolioCards>
              {!positionsLoading &&
                positions.length > 0 &&
                positions.map((position, index) => {
                  return (
                    <PortfolioCard
                      key={index}
                      token0={GetTokenData(
                        position.pool.token0Address.toLowerCase()
                      )}
                      token1={GetTokenData(
                        position.pool.token1Address.toLowerCase()
                      )}
                      silo0={GetSiloData(
                        position.pool.silo0Address.toLowerCase()
                      )}
                      silo1={GetSiloData(
                        position.pool.silo1Address.toLowerCase()
                      )}
                      uniswapFeeTier={position.pool.feeTier}
                      estimatedValue={position.estimatedValue}
                      percentageChange={0}
                    />
                  );
                })}
              {positionsLoading && <PortfolioCardPlaceholder /> }
            </PortfolioCards>
          )}
          {!positionsLoading && positions.length === 0 && (
            <div className='w-full mt-6'>
              <EmptyPortfolio />
            </div>
          )}
        </div>
        <div className='w-full max-w-[1280px]'>
          <div className='flex justify-between items-center'>
            <Text
              size='XL'
              weight='medium'
              color={PORTFOLIO_TITLE_TEXT_COLOR}
            >
              Your External Positions
            </Text>
            <Tooltip
              content='Est nisl feugiat turpis amet, in sit bibendum tincidunt et. Vitae aliquam quam tempor, facilisi.'
              buttonText='What is this?'
              buttonSize={isGTMediumScreen ? 'L' : 'M'}
              position='top-right'
              filled={true}
            />
          </div>
          {(externalPositionsLoading || externalPositions.length > 0) && (
            <PortfolioCards>
              {!externalPositionsLoading &&
                externalPositions.length > 0 &&
                externalPositions.map((position, index) => (
                  <ExternalPortfolioCard
                    key={index}
                    token0={GetTokenData(
                      position.pool.token0Address.toLowerCase()
                    )}
                    token1={GetTokenData(
                      position.pool.token1Address.toLowerCase()
                    )}
                    externalPositionName={position.externalPositionName}
                    estimatedValue={position.estimatedValue}
                    percentageChange={0}
                  />
                ))}
              {externalPositionsLoading && <ExternalPortfolioCardPlaceholder />}
            </PortfolioCards>
          )}
          {!externalPositionsLoading && externalPositions.length === 0 && (
            <div className='w-full mt-6'>
              <EmptyExternalPortfolio />
            </div>
          )}
        </div>
      </Container>
    </AppPage>
  );
}
