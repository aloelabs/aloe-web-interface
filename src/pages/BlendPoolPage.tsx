import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeading from '../components/common/PageHeading';
import { LinkButtonWithIcon } from '../components/common/Buttons';
import BackArrowPurple from '../assets/svg/back_arrow_purple.svg';
import OpenIcon from '../assets/svg/open.svg';
import { ResolveBlendPoolDrawData } from '../data/BlendPoolDataResolver';
import PoolInteractionTabs from '../components/pool/PoolInteractionTabs';
import BackgroundBlobs from '../components/pool/BackgroundBlobs';
import BlendStampHolo from '../components/common/BlendStampHolo';
// import BlendAllocationGraph from '../components/allocationgraph/BlendAllocationGraph';
import PoolStatsWidget from '../components/poolstats/PoolStatsWidget';
import { BlendTableContext } from '../data/context/BlendTableContext';
import { BlendPoolProvider } from '../data/context/BlendPoolContext';
import PoolPieChartWidget from '../components/poolstats/PoolPieChartWidget';
import PoolUniswapPositionWidget from '../components/poolstats/PoolUniswapPositionWidget';

type PoolParams = {
  pooladdress: string;
};

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
      <div className='flex flex-row justify-center'>
      <div className='h-full max-w-[1260px] flex flex-row flex-nowrap gap-16 pt-10 px-36'>
      {/* max-w-screen-sm px-6 sm:px-10 md:px-20 */}
        <div className='basis-3/5 relative'> {/* using relative so that BackgroundBlobs behave */}
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
          <BackgroundBlobs />
          <BlendStampHolo poolData={poolData} />
          <div className='text-grey-700 pt-8 pb-4'>
            <p>
              This pool provides liquidity to the {poolDrawData.token0Label}/
              {poolDrawData.token1Label} pair on Uniswap&nbsp;V3. It maintains
              the same liquidity density as a full&#8209;width position, and
              liquidity far from the current price is deposited
              to {combinedSiloLabel} to earn extra yield.
            </p>
          </div>

          <div className='w-full pt-4'>
            {/*<BlendAllocationGraph />*/}
            <PoolPieChartWidget poolData={poolData} />
            <PoolUniswapPositionWidget poolData={poolData} />
            <PoolStatsWidget poolData={poolData} />
          </div>
        </div>
        <div className='basis-2/5 pt-24'>
          <div className='w-full'>
            <PoolInteractionTabs poolData={poolData} />
          </div>
        </div>
      </div>
      </div>
    </BlendPoolProvider>
  );
}
