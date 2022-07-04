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
  RESPONSIVE_BREAKPOINT_SM
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

const ABOUT_MESSAGE_TEXT_COLOR = 'rgba(130, 160, 182, 1)';

type PoolParams = {
  pooladdress: string;
};

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
`;

const HeaderBarContainer = styled.div`
  ${tw`flex items-center relative pt-16`}
  flex-direction: row;
  gap: 32px;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    display: grid;
    grid-template-columns: fit-content(35px) fit-content(400px) fit-content(24px);
    align-items: flex-start;
    justify-content: flex-start;
    gap: 16px;
  }
`;

export default function BlendPoolPage() {
  const [offChainPoolStats, setOffChainPoolStats] = React.useState<OffChainPoolStats>();
  const params = useParams<PoolParams>();
  const navigate = useNavigate();
  const isMediumScreen = useMediaQuery(RESPONSIVE_BREAKPOINTS.MD);

  const { poolDataMap, fetchPoolData } = useContext(BlendTableContext);

  const poolData = poolDataMap.get(params.pooladdress || '');

  useEffect(() => {
    let mounted = true;
    const fetchPoolStats = async () => {
      const response = await axios.get(
        `${API_URL}/pool_stats/${poolData?.poolAddress}/1/`
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

  const [{ data: accountData }] = useAccount({ fetchEns: true });
  const walletIsConnected = accountData?.address !== undefined;

  if (!poolData) {
    if (params.pooladdress) {
      fetchPoolData(params.pooladdress);
    }
    return <div>Finding pool...</div>;
  }

  return (
    <BlendPoolProvider poolData={poolData}>
      <PoolBodyWrapper>
        <HeaderBarContainer>
          <PreviousPageButton onClick={() => navigate('../pools')} />
          <TokenPairHeader
            token0={GetTokenData(poolData.token0Address.toLowerCase())}
            token1={GetTokenData(poolData.token1Address.toLowerCase())}
            silo0={GetSiloData(poolData.silo0Address.toLowerCase())}
            silo1={GetSiloData(poolData.silo1Address.toLowerCase())}
            feeTier={poolData.feeTier}
          />
          <a href={`https://etherscan.io/address/${poolData.poolAddress}`} target='_blank' title='Etherscan Link'>
            <OpenIcon width={24} height={24} />
          </a>
        </HeaderBarContainer>
        {isMediumScreen && (
          <GridExpandingDiv className='w-full min-w-[300px] md:mt-24 md:grid-flow-row-dense'>
            <PoolInteractionTabs poolData={poolData} walletIsConnected={walletIsConnected} />
          </GridExpandingDiv>
        )}
        <div className='w-full py-4'>
          <BlendAllocationGraph poolData={poolData} />
          {!isMediumScreen && (
            <GridExpandingDiv className='w-full min-w-[300px] md:mt-24 md:grid-flow-row-dense'>
              <PoolInteractionTabs poolData={poolData} walletIsConnected={walletIsConnected} />
            </GridExpandingDiv>
          )}
          {walletIsConnected && (
            <PoolPositionWidget poolData={poolData} />
          )}
          <PoolStatsWidget offChainPoolStats={offChainPoolStats} />
          <PoolPieChartWidget poolData={poolData} />
          <div className='flex flex-col gap-y-6 mt-16'>
            <WidgetHeading>About The Pool</WidgetHeading>
            <Text size='M' weight='medium' color={ABOUT_MESSAGE_TEXT_COLOR} className='flex flex-col gap-y-6'>
              <p>
                Placing funds into a Blend Pool will allow Aloe smart contracts to use Uniswap
                V3 and yield-earning silos on your behalf.
              </p>
              <p>
                When you deposit, your tokens are pooled together with other users'. Once
                conditions are right, the pool can be rebalanced. During a rebalance, the
                pool's algorithm redistributes funds between Uniswap and silos to earn
                the best mix of swap fees and yield. It also tries to keep itself balanced — 
                50% {GetTokenData(poolData.token0Address.toLowerCase()).ticker} and
                50% {GetTokenData(poolData.token1Address.toLowerCase()).ticker}, just
                like Uniswap V2. In the right market conditions, this can massively <a href='https://research.paradigm.xyz/uniswaps-alchemy' target='_blank' className='underline'>outperform plain HODLing</a>.
              </p>
            </Text>
          </div>
          <div className='flex flex-col gap-y-6 mt-16'>
            <WidgetHeading>Investing Risks</WidgetHeading>
            <RiskCard />
          </div>
        </div>
      </PoolBodyWrapper>
    </BlendPoolProvider>
  );
}
