import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import BlendAllocationGraph from '../components/allocationgraph/BlendAllocationGraph';
import { PreviousPageButton } from '../components/common/Buttons';
import RiskCard from '../components/common/RiskCard';
import { Text } from '../components/common/Typography';
import WidgetHeading from '../components/common/WidgetHeading';
import PoolInteractionTabs from '../components/pool/PoolInteractionTabs';
import TokenPairHeader from '../components/pool/TokenPairHeader';
import PoolPieChartWidget from '../components/poolstats/PoolPieChartWidget';
import PoolPositionWidget from '../components/poolstats/PoolPositionWidget';
import PoolStatsWidget from '../components/poolstats/PoolStatsWidget';
import {
  RESPONSIVE_BREAKPOINTS,
  RESPONSIVE_BREAKPOINT_LG,
  RESPONSIVE_BREAKPOINT_MD,
  RESPONSIVE_BREAKPOINT_SM,
  RESPONSIVE_BREAKPOINT_XS,
} from '../data/constants/Breakpoints';
import { API_URL } from '../data/constants/Values';
import { BlendPoolProvider } from '../data/context/BlendPoolContext';
import { BlendTableContext } from '../data/context/BlendTableContext';
import { OffChainPoolStats } from '../data/PoolStats';
import { GetSiloData } from '../data/SiloData';
import { GetTokenData } from '../data/TokenData';
import { ReactComponent as OpenIcon } from '../assets/svg/open.svg';
import tw from 'twin.macro';
import useMediaQuery from '../data/hooks/UseMediaQuery';
import { useAccount } from 'wagmi';
import { FeeTier } from '../data/BlendPoolMarkers';
import { theGraphUniswapV3Client } from '../App';
import { getUniswapVolumeQuery } from '../util/GraphQL';
import { IOSStyleSpinner } from '../components/common/Spinner';

const ABOUT_MESSAGE_TEXT_COLOR = 'rgba(130, 160, 182, 1)';

type PoolParams = {
  pooladdress: string;
};

const LoaderWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`;

const PoolBodyWrapper = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: calc(70% - 16px) calc(30% - 16px);
  gap: 32px;
  padding-left: 64px;
  padding-right: 64px;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_LG}) {
    grid-template-columns: calc(60% - 16px) calc(40% - 16px);
  }

  @media (max-width: ${RESPONSIVE_BREAKPOINT_MD}) {
    grid-template-columns: 100%;
    gap: 0;
  }

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    padding-left: 32px;
    padding-right: 32px;
  }

  @media (max-width: ${RESPONSIVE_BREAKPOINT_XS}) {
    // TODO: standardize this across all pages that use this padding
    padding-left: 16px;
    padding-right: 16px;
  }
`;

const GridExpandingDiv = styled.div`
  grid-row: 1 / span 2;
  grid-column: 2 / span 1;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_MD}) {
    grid-row: 2 / span 1;
    grid-column: 1 / span 1;
    margin-top: 64px;
    margin-bottom: 64px;
  }

  @media (max-width: ${RESPONSIVE_BREAKPOINT_XS}) {
    margin-top: 48px;
    margin-bottom: 48px;
  }
`;

const HeaderBarContainer = styled.div`
  ${tw`flex items-center relative`}
  flex-direction: row;
  padding-top: 64px;
  gap: 32px;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    display: grid;
    grid-template-columns: fit-content(35px) fit-content(400px) fit-content(
        24px
      );
    align-items: flex-start;
    justify-content: flex-start;
    gap: 16px;
  }

  @media (max-width: ${RESPONSIVE_BREAKPOINT_XS}) {
    display: flex;
    justify-content: space-between;
    padding-top: 48px;
    gap: 0;
  }
`;

const GeneralPoolSectionContainer = styled.div`
  ${tw`flex flex-col`}
  margin-top: 64px;
  row-gap: 16px;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_XS}) {
    margin-top: 48px;
  }
`;

export type BlendPoolPageProps = {
  blockNumber: string | null;
};

export default function BlendPoolPage(props: BlendPoolPageProps) {
  const { blockNumber } = props;
  const [offChainPoolStats, setOffChainPoolStats] =
    React.useState<OffChainPoolStats>();
  const [uniswapVolume, setUniswapVolume] = React.useState<number | null>(null);
  const params = useParams<PoolParams>();
  const navigate = useNavigate();
  const isGTMediumScreen = useMediaQuery(RESPONSIVE_BREAKPOINTS.MD);
  const isGTSmallScreen = useMediaQuery(RESPONSIVE_BREAKPOINTS.SM);

  const { poolDataMap, fetchPoolData } = useContext(BlendTableContext);

  const poolData = poolDataMap.get(params.pooladdress || '');

  useEffect(() => {
    let mounted = true;
    const fetchPoolStats = async () => {
      const response = await axios.get(
        `${API_URL}/pool_stats/${poolData?.poolAddress}/1`
      );
      const poolStatsData = response.data[0] as OffChainPoolStats;
      if (mounted && poolStatsData) {
        setOffChainPoolStats(poolStatsData);
      }
    };
    if (poolData) {
      fetchPoolStats();
    }
    return () => {
      mounted = false;
    };
  }, [poolData]);

  useEffect(() => {
    let mounted = true;
    const fetchData = async (
      token0Address: string,
      token1Address: string,
      feeTier: FeeTier
    ) => {
      const uniswapVolumeQuery = getUniswapVolumeQuery(
        blockNumber,
        token0Address,
        token1Address,
        feeTier
      );
      const uniswapVolumeData = await theGraphUniswapV3Client.query({
        query: uniswapVolumeQuery,
      });

      if (mounted) {
        setUniswapVolume(
          uniswapVolumeData['data']
            ? uniswapVolumeData['data']['curr'][0]['volumeUSD'] -
                uniswapVolumeData['data']['prev'][0]['volumeUSD']
            : null
        );
      }
    };
    if (blockNumber && poolData) {
      fetchData(
        poolData.token0Address,
        poolData.token1Address,
        poolData.feeTier
      );
    }
    return () => {
      mounted = false;
    };
  }, [blockNumber, poolData]);

  const { address } = useAccount();
  const walletIsConnected = address !== undefined;

  if (!poolData) {
    if (params.pooladdress) {
      fetchPoolData(params.pooladdress);
    }
    return (
      <LoaderWrapper>
        <IOSStyleSpinner
          size={isGTMediumScreen ? 'L' : isGTSmallScreen ? 'M' : 'S'}
        />
      </LoaderWrapper>
    );
  }

  return (
    <BlendPoolProvider poolData={poolData}>
      <PoolBodyWrapper>
        <div>
          <HeaderBarContainer>
            <PreviousPageButton onClick={() => navigate('../pools')} />
            <TokenPairHeader
              token0={GetTokenData(poolData.token0Address.toLowerCase())}
              token1={GetTokenData(poolData.token1Address.toLowerCase())}
              silo0={GetSiloData(poolData.silo0Address.toLowerCase())}
              silo1={GetSiloData(poolData.silo1Address.toLowerCase())}
              feeTier={poolData.feeTier}
            />
            <a
              href={`https://etherscan.io/address/${poolData.poolAddress}`}
              target='_blank'
              title='Etherscan Link'
              rel='noreferrer'
            >
              <OpenIcon width={24} height={24} />
            </a>
          </HeaderBarContainer>
          <div className='w-full py-4'>
            <BlendAllocationGraph poolData={poolData} />
          </div>
        </div>
        <GridExpandingDiv className='w-full min-w-[300px] md:mt-24 md:grid-flow-row-dense'>
          <PoolInteractionTabs
            poolData={poolData}
            walletIsConnected={walletIsConnected}
            offChainPoolStats={offChainPoolStats}
          />
        </GridExpandingDiv>
        <div className='w-full py-4'>
          {walletIsConnected && (
            <PoolPositionWidget
              walletIsConnected={walletIsConnected}
              poolData={poolData}
              offChainPoolStats={offChainPoolStats}
              accountAddress={address}
            />
          )}
          <PoolStatsWidget
            offChainPoolStats={offChainPoolStats}
            uniswapVolume={uniswapVolume}
          />
          <PoolPieChartWidget poolData={poolData} />
          <GeneralPoolSectionContainer>
            <WidgetHeading>About The Pool</WidgetHeading>
            <Text
              size='M'
              weight='medium'
              color={ABOUT_MESSAGE_TEXT_COLOR}
              className='flex flex-col gap-y-6'
            >
              <p>
                Placing assets into a Blend Pool will allow the Aloe Protocol to
                use Uniswap V3 and yield-earning silos on your behalf.
              </p>
              <p>
                When you deposit, your tokens are pooled together with other
                users'. Once conditions are right, the pool can be rebalanced.
                During a rebalance, the pool's algorithm redistributes funds
                between Uniswap and silos to earn the best mix of swap fees and
                yield. It also tries to keep itself balanced — 50%{' '}
                {GetTokenData(poolData.token0Address.toLowerCase()).ticker} and
                50% {GetTokenData(poolData.token1Address.toLowerCase()).ticker},
                just like Uniswap V2. In the right market conditions, this can
                massively{' '}
                <a
                  href='https://research.paradigm.xyz/uniswaps-alchemy'
                  target='_blank'
                  className='underline'
                  rel='noreferrer noopener'
                >
                  outperform plain HODLing
                </a>
                .
              </p>
            </Text>
          </GeneralPoolSectionContainer>
          <GeneralPoolSectionContainer>
            <WidgetHeading>Investing Risks</WidgetHeading>
            <RiskCard />
          </GeneralPoolSectionContainer>
        </div>
      </PoolBodyWrapper>
    </BlendPoolProvider>
  );
}
