import React, { useContext, useState } from 'react';
import { TertiaryButton } from '../components/common/Buttons';
import { BlendPoolMarkers } from '../data/BlendPoolMarkers';
import BlendPoolSelectTableRow from '../components/poolselect/BlendPoolSelectTableRow';
import { TextInput } from '../components/common/Input';
import SearchIcon from '../assets/svg/search.svg';
import AppPage from '../components/common/AppPage';
import PageHeading from '../components/common/PageHeading';
import { BlendTableContext } from '../data/context/BlendTableContext';
import { ResolveBlendPoolDrawData } from '../data/BlendPoolDataResolver';
import Pagination from '../components/common/Pagination';

export default function BlendPoolSelectPage() {
  const [searchText, setSearchText] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

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

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
  };

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
          <TertiaryButton
            name='Deploy New Pool'
            className='flex-none px-8 py-3'
          >
            Deploy&nbsp;New&nbsp;Pool
          </TertiaryButton>
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
      <Pagination
        currentPage={page}
        itemsPerPage={itemsPerPage}
        totalItems={100}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </AppPage>
  );
}
