import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PoolInteractionTabs from '../components/pool/PoolInteractionTabs';
import BlendAllocationGraph from '../components/allocationgraph/BlendAllocationGraph';
import PoolStatsWidget from '../components/poolstats/PoolStatsWidget';
import { BlendTableContext } from '../data/context/BlendTableContext';
import { BlendPoolProvider } from '../data/context/BlendPoolContext';
import PoolPieChartWidget from '../components/poolstats/PoolPieChartWidget';
import styled from 'styled-components';
import { RESPONSIVE_BREAKPOINT_LG, RESPONSIVE_BREAKPOINT_MD, RESPONSIVE_BREAKPOINT_SM } from '../data/constants/Breakpoints';
import PoolPositionWidget from '../components/poolstats/PoolPositionWidget';
import TokenPairHeader from '../components/pool/TokenPairHeader';
import { GetTokenData } from '../data/TokenData';
import { GetSiloData } from '../data/SiloData';
import { PreviousPageButton } from '../components/common/Buttons';
import FeeTierContainer from '../components/common/FeeTierContainer';

const AbsoluteFeeTierContainer = styled(FeeTierContainer)`
  position: absolute;
  bottom: -56px;
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

export default function BlendPoolPage() {
  const params = useParams<PoolParams>();
  const navigate = useNavigate();

  const { poolDataMap, fetchPoolData } = useContext(BlendTableContext);

  const poolData = poolDataMap.get(params.pooladdress || '');
  if (!poolData) {
    if (params.pooladdress) {
      fetchPoolData(params.pooladdress);
    }
    return <div>Finding pool...</div>;
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
          <AbsoluteFeeTierContainer feeTier={poolData.feeTier} />
        </div>
        <GridExpandingDiv className='w-full min-w-[340px] md:mt-24 md:grid-flow-row-dense'>
          <PoolInteractionTabs poolData={poolData} />
        </GridExpandingDiv>
        <div className='w-full py-4'>
          <BlendAllocationGraph />
          <PoolPositionWidget poolData={poolData} />
          <PoolStatsWidget poolData={poolData} />
          <PoolPieChartWidget poolData={poolData} />
        </div>
      </PoolBodyWrapper>
    </BlendPoolProvider>
  );
}
