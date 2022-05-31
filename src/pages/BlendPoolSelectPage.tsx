import React, { useContext, useState } from 'react';
import LeftArrow from '../assets/svg/left_arrow.svg';
import EllipsesIcon from '../assets/svg/more_ellipses.svg';
import { ReactComponent as PlusIcon } from '../assets/svg/white_plus.svg';
import RightArrow from '../assets/svg/right_arrow.svg';
import SearchIcon from '../assets/svg/search.svg';
import AppPage from '../components/common/AppPage';
import { OutlinedGradientRoundedButtonWithIcon } from '../components/common/Buttons';
import { TextInput } from '../components/common/Input';
import PageHeading from '../components/common/PageHeading';
import BlendPoolSelectTableRow from '../components/poolselect/BlendPoolSelectTableRow';
import { ResolveBlendPoolDrawData } from '../data/BlendPoolDataResolver';
import { BlendPoolMarkers } from '../data/BlendPoolMarkers';
import { BlendTableContext } from '../data/context/BlendTableContext';

export default function BlendPoolSelectPage() {
  const [searchText, setSearchText] = useState<string>('');

  const { poolDataMap } = useContext(BlendTableContext);

  let pools: BlendPoolMarkers[] = Array.from(poolDataMap.values());

  if (searchText.length > 0) {
    pools = pools.filter((pool) => {
      const {
        silo0Name,
        silo1Name,
        silo0Label,
        silo1Label,
        token0Label,
        token1Label,
      } = ResolveBlendPoolDrawData(pool);

      return (
        [
          silo0Name,
          silo1Name,
          silo0Label,
          silo1Label,
          token0Label,
          token1Label,
        ].findIndex((field) => {
          return field.toLowerCase().includes(searchText.toLowerCase());
        }) !== -1
      );
    });
  }

  return (
    <AppPage>
      <div>
        <PageHeading>Browse Deployed Pools</PageHeading>
      </div>
      <div className='py-4 flex flex-row items-center justify-between text-lg'>
        <TextInput
          className='lg:basis-5/12 md:basis-1/2 md:grow-0 sm:basis-0 sm:grow sm:mr-12'
          icon={SearchIcon}
          placeholder='Search by name or symbol'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <a
          href='https://docs.aloe.capital/aloe-blend/overview/creating-a-pool'
          target='_blank'
          rel='noopener noreferrer'
          tabIndex={-1}
        >
          <OutlinedGradientRoundedButtonWithIcon
            size='L'
            position='trailing'
            activeGradientId='#plus-icon-gradient'
            svgColorType='stroke'
            name='Deploy New Pool'
            Icon={<PlusIcon />}
          >
            <span>Deploy&nbsp;New&nbsp;Pool</span>
          </OutlinedGradientRoundedButtonWithIcon>
        </a>
      </div>
      <div className='text-left rounded-md border-2 border-grey-200'>
        <table className='w-full'>
          <thead>
            <tr className='bg-grey-200'>
              <th className='p-4'>Token&nbsp;Pair</th>
              <th className='p-4'>
                Additional&nbsp;Sources&nbsp;of&nbsp;Yield
              </th>
              <th className='p-4'></th>
              <th className='p-4'>Uniswap&nbsp;Fee&nbsp;Tier</th>
              {/*<th className='p-4'>TVL</th>*/}
            </tr>
          </thead>
          <tbody className=''>
            {pools.map((pool, index, array) => {
              return (
                <React.Fragment key={index}>
                  <BlendPoolSelectTableRow poolData={pool} />
                  {/* Insert Partial-width divider */}
                  {index !== array.length - 1 && (
                    <tr className='w-full'>
                      <td colSpan={4} className='w-full h-full'>
                        <div className='flex flex-row items-center justify-center px-4'>
                          <div className='border-b-2 border-b-grey-200 grow' />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className='w-full h-10 bg-grey-200 rounded-md mt-8 pl-4 flex flex-row items-center justify-between text-sm text-grey-800 select-none'>
        <button>
          <img alt='More' src={EllipsesIcon} />
        </button>
        <div className='flex flex-row items-center justify-between space-x-8 mr-4'>
          <button className='text-grey-800'>
            <img alt='Prev' src={LeftArrow} />
          </button>
          <span>Page&nbsp;1&nbsp;of&nbsp;1</span>
          <button className=''>
            <img className='' alt='Prev' src={RightArrow} />
          </button>
        </div>
      </div>
    </AppPage>
  );
}
