import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PoolInteractionTabs from '../components/pool/PoolInteractionTabs';
// import BlendAllocationGraph from '../components/allocationgraph/BlendAllocationGraph';
import PoolStatsWidget from '../components/poolstats/PoolStatsWidget';
import { BlendTableContext } from '../data/context/BlendTableContext';
import { BlendPoolProvider } from '../data/context/BlendPoolContext';
import PoolPieChartWidget from '../components/poolstats/PoolPieChartWidget';
import styled from 'styled-components';
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

const GridExpandingDiv = styled.div`
  grid-row: 1 / span 2;
  grid-column: 2 / span 1;
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
      <div className='flex flex-row justify-center'>
        <div className='h-full max-w-[600px] md:max-w-[1260px] flex flex-row flex-nowrap gap-12 py-16 px-12 md:px-36'>
          {/* max-w-screen-sm px-6 sm:px-10 md:px-20 */}
          <div className='flex flex-col md:grid md:gap-x-10 md:grid-cols-[3fr_2fr]'>
            <div className='flex items-center gap-8 relative'>
              <PreviousPageButton onClick={() => navigate('../pools')} />
              <TokenPairHeader
                token0={GetTokenData(poolData.token0Address.toLowerCase())}
                token1={GetTokenData(poolData.token1Address.toLowerCase())}
                silo0={GetSiloData(poolData.silo0Address.toLowerCase())}
                silo1={GetSiloData(poolData.silo1Address.toLowerCase())}
              />
              <AbsoluteFeeTierContainer feeTier={poolData.feeTier} />
            </div>
            <GridExpandingDiv className='w-full min-w-[340px] md:mt-24 sm:mt-24 md:grid-flow-row-dense'>
              <PoolInteractionTabs poolData={poolData} />
            </GridExpandingDiv>
            <div className='w-full py-4 mt-16'>
              {/*<BlendAllocationGraph />*/}
              <PoolPositionWidget poolData={poolData} />
              <PoolStatsWidget poolData={poolData} />
              <PoolPieChartWidget poolData={poolData} />
            </div>
          </div>
        </div>
      </div>
    </BlendPoolProvider>
  );
}
