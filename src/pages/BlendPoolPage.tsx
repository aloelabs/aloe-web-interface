import axios from 'axios';
import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import BlendAllocationGraph from '../components/allocationgraph/BlendAllocationGraph';
import { PreviousPageButton } from '../components/common/Buttons';
import FeeTierContainer from '../components/common/FeeTierContainer';
import RiskCard from '../components/common/RiskCard';
import { Text } from '../components/common/Typography';
import WidgetHeading from '../components/common/WidgetHeading';
import PoolInteractionTabs from '../components/pool/PoolInteractionTabs';
import TokenPairHeader from '../components/pool/TokenPairHeader';
import PoolPieChartWidget from '../components/poolstats/PoolPieChartWidget';
import PoolPositionWidget from '../components/poolstats/PoolPositionWidget';
import PoolStatsWidget from '../components/poolstats/PoolStatsWidget';
import {
  RESPONSIVE_BREAKPOINT_LG,
  RESPONSIVE_BREAKPOINT_MD,
  RESPONSIVE_BREAKPOINT_SM,
} from '../data/constants/Breakpoints';
import { API_URL } from '../data/constants/Values';
import { BlendPoolProvider } from '../data/context/BlendPoolContext';
import { BlendTableContext } from '../data/context/BlendTableContext';
import { PoolStats } from '../data/PoolStats';
import { GetSiloData } from '../data/SiloData';
import { GetTokenData } from '../data/TokenData';
import { ReactComponent as OpenIcon } from '../assets/svg/open.svg';
import { PoolInteractionTabsPlaceholder } from '../components/pool/PoolInteractionTabsPlaceholder';
import { TokenPairHeaderPlaceholder } from '../components/pool/TokenPairHeaderPlaceholder';

const ABOUT_MESSAGE_TEXT_COLOR = 'rgba(130, 160, 182, 1)';

const AbsoluteFeeTierContainer = styled(FeeTierContainer)`
  position: absolute;
  top: 140px;
  left: 67px;
`;

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
    margin-top: 96px;
    margin-bottom: 32px;
  }
`;

const OpenIconPlaceholder = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: #0d171e;
  background-image: linear-gradient(
    to right,
    #0d171e 0%,
    #131f28 20%,
    #0d171e 40%,
    #0d171e 100%
  );
  background-repeat: no-repeat;
  background-size: 24px 24px;
  display: inline-block;
  animation: shimmerOpenIcon 1s forwards linear infinite;

  @keyframes shimmerOpenIcon {
    0% {
      background-position: -24px 0;
    }
    100% {
      background-position: 24px 0;
    }
  }
`;

const PositionWidgetPlaceholder = styled.div`
  display: grid;
  grid-template-columns: calc(50% - 8px) calc(50% - 8px);
  grid-template-rows: 1fr 1fr;
  gap: 16px;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_MD}) {
    grid-template-columns: 1fr;
  }
`;

const PositionPlaceholder = styled.div`
  width: 100%;
  height: 120px;
  border-radius: 8px;
  background: #0d171e;
  background-image: linear-gradient(
    to right,
    #0d171e 0%,
    #131f28 20%,
    #0d171e 40%,
    #0d171e 100%
  );
  background-repeat: no-repeat;
  background-size: 800px 120px;
  display: inline-block;
  animation: shimmerPosition 1s forwards linear infinite;

  @keyframes shimmerPosition {
    0% {
      background-position: -800px 0;
    }
    100% {
      background-position: 800px 0;
    }
  }
`;

const FeeTierContainerPlaceholder = styled.div`
  position: absolute;
  top: 140px;
  left: 67px;
  width: 192.4px;
  height: 36px;
  border-radius: 100px;
  background: #0d171e;
  background-image: linear-gradient(
    to right,
    #0d171e 0%,
    #131f28 20%,
    #0d171e 40%,
    #0d171e 100%
  );
  background-repeat: no-repeat;
  background-size: 192.4px 36px;
  display: inline-block;
  animation: shimmerFeeTierContainer 1s forwards linear infinite;

  @keyframes shimmerFeeTierContainer {
    0% {
      background-position: -192.4px 0;
    }
    100% {
      background-position: 192.4px 0;
    }
  }
`;

const HeaderPlaceholder = styled.div.attrs((props: { width: string }) => props)`
  width: ${(props) => props.width};
  height: 30px;
  border-radius: 4px;
  background: #0d171e;
  background-image: linear-gradient(
    to right,
    #0d171e 0%,
    #131f28 20%,
    #0d171e 40%,
    #0d171e 100%
  );
  background-repeat: no-repeat;
  background-size: ${(props) => props.width} 30px;
  display: inline-block;
  animation: shimmerHeader 1s forwards linear infinite;

  @keyframes shimmerHeader {
    0% {
      background-position: -${(props) => props.width} 0;
    }
    100% {
      background-position: ${(props) => props.width} 0;
    }
  }
`;

const StatsWidgetPlaceholder = styled.div`
  display: grid;
  grid-template-columns: calc(50% - 12px) calc(50% - 12px);
  column-gap: 24px;
  border-top: 1px solid rgba(26, 41, 52, 1);
`;

const StatsWrapperPlaceholder = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 8px;
  border-bottom: 1px solid rgba(26, 41, 52, 1);
`;

const StatsPlaceholder = styled.div`
  width: 100%;
  height: 24px;
  border-radius: 4px;
  background: #0d171e;
  background-image: linear-gradient(
    to right,
    #0d171e 0%,
    #131f28 20%,
    #0d171e 40%,
    #0d171e 100%
  );
  background-repeat: no-repeat;
  background-size: 423.2px 48px;
  display: inline-block;
  animation: shimmerStats 1s forwards linear infinite;

  @keyframes shimmerStats {
    0% {
      background-position: -423.2px 0;
    }
    100% {
      background-position: 423.2px 0;
    }
  }
`;

const PieChartPlaceholder = styled.div`
  position: relative;
  width: 227px;
  height: 227px;
  border-radius: 100%;
  background: #0d171e;
  background-image: linear-gradient(
    to right,
    #0d171e 0%,
    #131f28 20%,
    #0d171e 40%,
    #0d171e 100%
  );
  background-repeat: no-repeat;
  background-size: 227px 227px;
  display: inline-block;
  animation: shimmerPieChart 1s forwards linear infinite;

  @keyframes shimmerPieChart {
    0% {
      background-position: -227px 0;
    }
    100% {
      background-position: 227px 0;
    }
  }
`;

const InnerPieChartPlaceholder = styled.div`
  position: absolute;
  top: calc(50% - 72.64px);
  left: calc(50% - 72.64px);
  width: 145.28px;
  height: 145.28px;
  border-radius: 100%;
  background: rgba(7, 14, 18, 1);
`;

function AboutAndRiskCards() {
  return (
    <>
      <div className='flex flex-col gap-y-6 mt-16'>
        <WidgetHeading>About Aloe Blend Pool</WidgetHeading>
        <Text
          size='M'
          weight='medium'
          color={ABOUT_MESSAGE_TEXT_COLOR}
          className='flex flex-col gap-y-6'
        >
          <p>
            Placing funds into a Blend Vault will allow Aloe to use Uniswap V3
            and yield-earning silos on your behalf.
          </p>
          <p>
            When you deposit to the vault, your tokens are pooled together with
            all other users. Once conditions are right, the vault can be
            "rebalanced". some tokens get placed in Uniswap, and some in the
            token's silo. Blend is designed to allocate tokens such that overall
            value will be split 50/50 between the two tokens, just like Uniswap
            V2. In Aloe Blend, you earn yield from both Uniswap V3 and the
            silos, unlike Uniswap V2.
          </p>
        </Text>
      </div>
      <div className='flex flex-col gap-y-6 mt-16'>
        <WidgetHeading>Investing Risk</WidgetHeading>
        <RiskCard />
      </div>
    </>
  );
}

export default function BlendPoolPage() {
  const [poolStats, setPoolStats] = React.useState<PoolStats>();
  const params = useParams<PoolParams>();
  const navigate = useNavigate();

  const { poolDataMap, fetchPoolData } = useContext(BlendTableContext);

  const poolData = poolDataMap.get(params.pooladdress || '');
  useEffect(() => {
    let mounted = true;
    const fetchPoolStats = async () => {
      const response = await axios.get(
        `${API_URL}/pool_stats/${poolData?.poolAddress}/1/`
      );
      const poolStatsData = response.data[0] as PoolStats;
      if (mounted && poolStatsData) {
        setPoolStats(poolStatsData);
      }
    };
    if (poolData) {
      fetchPoolStats();
    }
    return () => {
      mounted = false;
    };
  }, [poolData]);

  let isTrue = true;

  if (!poolData || isTrue) {
    if (params.pooladdress) {
      fetchPoolData(params.pooladdress);
    }
    return (
      <PoolBodyWrapper>
        <div className='flex items-center gap-8 relative pt-16'>
          <PreviousPageButton onClick={() => navigate('../pools')} />
          <TokenPairHeaderPlaceholder />
          <OpenIconPlaceholder />
          <FeeTierContainerPlaceholder />
        </div>
        <GridExpandingDiv className='w-full min-w-[340px] md:mt-24 md:grid-flow-row-dense'>
          <PoolInteractionTabsPlaceholder />
        </GridExpandingDiv>
        <div className='w-full py-4'>
          <BlendAllocationGraph poolData={null} />
          <div className='flex flex-col gap-4 mb-16'>
            <HeaderPlaceholder width='192.4px' />
            <PositionWidgetPlaceholder>
              <PositionPlaceholder />
              <PositionPlaceholder />
              <PositionPlaceholder />
              <PositionPlaceholder />
            </PositionWidgetPlaceholder>
          </div>
          <div className='flex flex-col gap-4 mb-16'>
            <HeaderPlaceholder width='192.4px' />
            <StatsWidgetPlaceholder>
              <StatsWrapperPlaceholder>
                <StatsPlaceholder />
              </StatsWrapperPlaceholder>
              <StatsWrapperPlaceholder>
                <StatsPlaceholder />
              </StatsWrapperPlaceholder>
              <StatsWrapperPlaceholder>
                <StatsPlaceholder />
              </StatsWrapperPlaceholder>
              <StatsWrapperPlaceholder>
                <StatsPlaceholder />
              </StatsWrapperPlaceholder>
              <StatsWrapperPlaceholder>
                <StatsPlaceholder />
              </StatsWrapperPlaceholder>
              <StatsWrapperPlaceholder>
                <StatsPlaceholder />
              </StatsWrapperPlaceholder>
            </StatsWidgetPlaceholder>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <HeaderPlaceholder width='192.4px' />
          <div className='flex flex-row'>
            <PieChartPlaceholder>
              <InnerPieChartPlaceholder />
            </PieChartPlaceholder>
            <div className='flex flex-col gap-y-12 ml-[45px]'>
              <div className='flex flex-row items-center gap-4'>
                <HeaderPlaceholder width='80px' />
                <div className='flex flex-col'>
                  <HeaderPlaceholder width='256px' />
                  <HeaderPlaceholder width='256px' />
                  <HeaderPlaceholder width='256px' />
                </div>
              </div>
              <div className='flex flex-row items-center gap-4'>
                <HeaderPlaceholder width='80px' />
                <div className='flex flex-col'>
                  <HeaderPlaceholder width='256px' />
                  <HeaderPlaceholder width='256px' />
                  <HeaderPlaceholder width='256px' />
                </div>
              </div>
            </div>
          </div>
          <AboutAndRiskCards />
        </div>
      </PoolBodyWrapper>
    );
  }

  return (
    <BlendPoolProvider poolData={poolData}>
      <PoolBodyWrapper>
        <div className='flex items-center gap-8 relative pt-16'>
          <PreviousPageButton onClick={() => navigate('../pools')} />
          <TokenPairHeader
            token0={GetTokenData(poolData.token0Address.toLowerCase())}
            token1={GetTokenData(poolData.token1Address.toLowerCase())}
            silo0={GetSiloData(poolData.silo0Address.toLowerCase())}
            silo1={GetSiloData(poolData.silo1Address.toLowerCase())}
          />
          <a href={`https://etherscan.io/address/${poolData.poolAddress}`}>
            <OpenIcon width={24} height={24} />
          </a>
          <AbsoluteFeeTierContainer feeTier={poolData.feeTier} />
        </div>
        <GridExpandingDiv className='w-full min-w-[340px] md:mt-24 md:grid-flow-row-dense'>
          <PoolInteractionTabs poolData={poolData} />
        </GridExpandingDiv>
        <div className='w-full py-4'>
          <BlendAllocationGraph poolData={poolData} />
          <PoolPositionWidget poolData={poolData} />
          <PoolStatsWidget poolStats={poolStats} />
          <PoolPieChartWidget poolData={poolData} />
          <AboutAndRiskCards />
        </div>
      </PoolBodyWrapper>
    </BlendPoolProvider>
  );
}
