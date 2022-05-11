import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeading from '../components/common/PageHeading';
import { LinkButtonWithIcon } from '../components/common/Buttons';
import BackArrowPurple from '../assets/svg/back_arrow_purple.svg';
import OpenIcon from '../assets/svg/open.svg';
import { ResolveBlendPoolDrawData } from '../data/BlendPoolDataResolver';
import PoolInteractionTabs from '../components/pool/PoolInteractionTabs';
import BlendStampHolo from '../components/common/BlendStampHolo';
import BlendAllocationGraph from '../components/allocationgraph/BlendAllocationGraph';
import PoolStatsWidget from '../components/poolstats/PoolStatsWidget';
import { BlendTableContext } from '../data/context/BlendTableContext';
import { BlendPoolProvider } from '../data/context/BlendPoolContext';
import PoolPieChartWidget from '../components/poolstats/PoolPieChartWidget';
import styled from 'styled-components';
import { RESPONSIVE_BREAKPOINT_LG, RESPONSIVE_BREAKPOINT_MD, RESPONSIVE_BREAKPOINT_SM } from '../data/constants/Breakpoints';

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
    margin-top: 32px;
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
  const poolDrawData = ResolveBlendPoolDrawData(poolData);

  const combinedSiloLabel = poolDrawData.silo0Label.concat(
    poolDrawData.silo0Label === poolDrawData.silo1Label
      ? ''
      : ` and ${poolDrawData.silo1Label}`
  );

  return (
    <BlendPoolProvider poolData={poolData}>
      {/* max-w-screen-sm px-6 sm:px-10 md:px-20 */}
      <PoolBodyWrapper>
        {/* using relative so that BackgroundBlobs behave */}
        <div className='relative'>
          <LinkButtonWithIcon
            onClick={() => {
              navigate('../pools');
            }}
            icon={BackArrowPurple}
            buttonClassName='py-1 px-2 text-md'
            className='p-1'
          >
            Go back
          </LinkButtonWithIcon>
          <PageHeading>
            <div className='flex flex-row items-center justify-start mb-4'>
              Aloe&nbsp;Blend&nbsp;Pool
              <a
                href={`https://etherscan.io/address/${params.pooladdress}`}
                target='_blank'
                rel='noopener noreferrer'
                className='ml-3'
              >
                <img src={OpenIcon} alt='' className='h-5 w-5' />
              </a>
            </div>
          </PageHeading>
          <BlendStampHolo poolData={poolData} />
          <div className='text-grey-700 pt-8 pb-4'>
            <p>
              This pool provides liquidity to the {poolDrawData.token0Label}/
              {poolDrawData.token1Label} pair on Uniswap&nbsp;V3. It maintains
              the same liquidity density as a full&#8209;width position, and
              liquidity far from the current price is deposited to{' '}
              {combinedSiloLabel} to earn extra yield.
            </p>
          </div>
        </div>
        <GridExpandingDiv className='w-full min-w-[340px] md:mt-24 md:grid-flow-row-dense'>
          <PoolInteractionTabs poolData={poolData} />
        </GridExpandingDiv>
        <div className='w-full py-4'>
          <BlendAllocationGraph />
          <PoolPieChartWidget poolData={poolData} />
          <PoolStatsWidget poolData={poolData} />
        </div>
      </PoolBodyWrapper>
    </BlendPoolProvider>
  );
}
