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
import { PoolStats } from '../data/PoolStats';
import { GetSiloData } from '../data/SiloData';
import { GetTokenData } from '../data/TokenData';
import { ReactComponent as OpenIcon } from '../assets/svg/open.svg';
import tw from 'twin.macro';
import useMediaQuery from '../data/hooks/UseMediaQuery';

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
  const [poolStats, setPoolStats] = React.useState<PoolStats>();
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
          <a href={`https://etherscan.io/address/${poolData.poolAddress}`} title='Etherscan Link'>
            <OpenIcon width={24} height={24} />
          </a>
        </HeaderBarContainer>
        {isMediumScreen && (
          <GridExpandingDiv className='w-full min-w-[300px] md:mt-24 md:grid-flow-row-dense'>
            <PoolInteractionTabs poolData={poolData} />
          </GridExpandingDiv>
        )}
        <div className='w-full py-4'>
          <BlendAllocationGraph poolData={poolData} />
          {!isMediumScreen && (
            <GridExpandingDiv className='w-full min-w-[300px] md:mt-24 md:grid-flow-row-dense'>
              <PoolInteractionTabs poolData={poolData} />
            </GridExpandingDiv>
          )}
          <PoolPositionWidget poolData={poolData} />
          <PoolStatsWidget poolStats={poolStats} />
          <PoolPieChartWidget poolData={poolData} />
          <div className='flex flex-col gap-y-6 mt-16'>
            <WidgetHeading>About Aloe Blend Pool</WidgetHeading>
            <Text size='M' weight='medium' color={ABOUT_MESSAGE_TEXT_COLOR} className='flex flex-col gap-y-6'>
              <p>
                Placing funds into a Blend Vault will allow Aloe to use Uniswap
                V3 and yield-earning silos on your behalf.
              </p>
              <p>
                When you deposit to the vault, your tokens are pooled together
                with all other users. Once conditions are right, the vault can
                be "rebalanced". some tokens get placed in Uniswap, and some in
                the token's silo. Blend is designed to allocate tokens such that
                overall value will be split 50/50 between the two tokens, just
                like Uniswap V2. In Aloe Blend, you earn yield from both Uniswap
                V3 and the silos, unlike Uniswap V2.
              </p>
            </Text>
          </div>
          <div className='flex flex-col gap-y-6 mt-16'>
            <WidgetHeading>Investing Risk</WidgetHeading>
            <RiskCard />
          </div>
        </div>
      </PoolBodyWrapper>
    </BlendPoolProvider>
  );
}
