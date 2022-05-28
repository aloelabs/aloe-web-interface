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
import styled from 'styled-components';
import tw from 'twin.macro';

type PoolParams = {
  pooladdress: string;
};

const GridExpandingDiv = styled.div`
  grid-row: 1 / span 2;
  grid-column: 2 / span 1;
`;

const SectionHeading = styled.div`
  font-size: 20px;
  font-weight: 400;
  line-height: 30px;
  color: rgba(255, 255, 255, 1);
`;

const AboutMessage = styled.div`
  ${tw`flex flex-col gap-y-6`}
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: rgba(130, 160, 182, 1);
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
      <div className='flex flex-row justify-center'>
        <div className='h-full max-w-[600px] md:max-w-[1260px] flex flex-row flex-nowrap gap-12 pt-10 px-12 md:px-36'>
          {/* max-w-screen-sm px-6 sm:px-10 md:px-20 */}
          <div className='flex flex-col md:grid md:gap-x-10 md:grid-cols-[3fr_2fr]'>
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
              <BackgroundBlobs />
              <BlendStampHolo poolData={poolData} />
              <div className='text-grey-700 pt-8 pb-4'>
                <p>
                  This pool provides liquidity to the {poolDrawData.token0Label}
                  /{poolDrawData.token1Label} pair on Uniswap&nbsp;V3. It
                  maintains the same liquidity density as a full&#8209;width
                  position, and liquidity far from the current price is
                  deposited to {combinedSiloLabel} to earn extra yield.
                </p>
              </div>
            </div>
            <GridExpandingDiv className='w-full min-w-[340px] md:mt-24 md:grid-flow-row-dense'>
              <PoolInteractionTabs poolData={poolData} />
            </GridExpandingDiv>
            <div className='w-full py-4'>
              {/*<BlendAllocationGraph />*/}
              <PoolPieChartWidget poolData={poolData} />
              <PoolStatsWidget poolData={poolData} />
              <div className='flex flex-col gap-y-6 mt-16'>
                <SectionHeading>About Aloe Blend Pool</SectionHeading>
                <AboutMessage>
                  <p>
                    Placing funds into a Blend Vault will allow Aloe to use
                    Uniswap V3 and yield-earning silos on your behalf.
                  </p>
                  <p>
                    When you deposit to the vault, your tokens are pooled
                    together with all other users. Once conditions are right,
                    the vault can be "rebalanced". some tokens get placed in
                    Uniswap, and some in the token's silo. Blend is designed to
                    allocate tokens such that overall value will be split 50/50
                    between the two tokens, just like Uniswap V2. In Aloe Blend,
                    you earn yield from both Uniswap V3 and the silos, unlike
                    Uniswap V2.
                  </p>
                  <p>Convert between ETH and WETH on Uniswap.</p>
                </AboutMessage>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BlendPoolProvider>
  );
}
