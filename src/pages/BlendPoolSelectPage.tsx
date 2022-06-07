import React, { useCallback, useContext, useEffect, useState } from 'react';
import { TertiaryButton } from '../components/common/Buttons';
import { BlendPoolMarkers } from '../data/BlendPoolMarkers';
import BlendPoolSelectTableRow from '../components/poolselect/BlendPoolSelectTableRow';
import { TextInput } from '../components/common/Input';
import SearchIcon from '../assets/svg/search.svg';
import AppPage from '../components/common/AppPage';
import { BlendTableContext } from '../data/context/BlendTableContext';
import { ResolveBlendPoolDrawData } from '../data/BlendPoolDataResolver';
import Pagination from '../components/common/Pagination';
import BrowsePoolsPerformance from '../components/browse/BrowsePoolsPerformance';
import { Display } from '../components/common/Typography';
import {
  DropdownOption,
  DropdownWithPlaceholder,
  MultiDropdown,
  MultiDropdownOption,
} from '../components/common/Dropdown';
import { GetTokenData } from '../data/TokenData';
import { FilterBadge } from '../components/common/FilterBadge';

export default function BlendPoolSelectPage() {
  const [searchText, setSearchText] = useState<string>('');
  const [pools, setPools] = useState<BlendPoolMarkers[]>([]);
  const [filteredPools, setFilteredPools] = useState<BlendPoolMarkers[]>([]);
  const [activePools, setActivePools] = useState<BlendPoolMarkers[]>([]);
  const [poolsToDisplay, setPoolsToDisplay] = useState<BlendPoolMarkers[]>([]);
  const [tokenOptions, setTokenOptions] = useState<MultiDropdownOption[]>([]);
  const [activeTokenOptions, setActiveTokenOptions] = useState<
    MultiDropdownOption[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const sortByOptions = [
    {
      label: 'Default',
      value: 'default',
      isDefault: true,
    },
    {
      label: 'Newest First',
      value: 'newest',
      isDefault: false,
    },
    {
      label: 'Oldest First',
      value: 'oldest',
      isDefault: false,
    }
  ] as DropdownOption[];
  const [selectedSortByOption, setSelectedSortByOption] = useState<DropdownOption>(sortByOptions[0]);

  const { poolDataMap } = useContext(BlendTableContext);
  const loadData = useCallback(async () => {
    let poolData = Array.from(poolDataMap.values()) as BlendPoolMarkers[];
    setPools(poolData);
    let tokenAddresses = Array.from(
      new Set(
        poolData.flatMap((pool) => [
          pool.token0Address.toLowerCase(),
          pool.token1Address.toLocaleLowerCase(),
        ])
      )
    );
    let tokenData = tokenAddresses.map((address) => GetTokenData(address));
    let tokenOptionData = tokenData.map(
      (data) =>
        ({
          label: data.ticker,
          value: data.address,
          icon: data.iconPath,
        } as MultiDropdownOption)
    );
    setTokenOptions(tokenOptionData);
    setActiveTokenOptions(tokenOptionData);
  }, [poolDataMap]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (searchText.length > 0 && pools.length > 0) {
      setFilteredPools(pools.filter((pool) => {
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
      }));
    } else if (pools.length > 0) {
      setFilteredPools(pools);
    }
  }, [searchText, pools]);

  useEffect(() => {
    if (activeTokenOptions.length > 0) {
      setActivePools(pools.filter((pool) => {
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
            return activeTokenOptions.map((option) => option.label.toLowerCase()).includes(field.toLowerCase());
          }) !== -1
        );
      }));
    } else if (pools.length > 0) {
      setActivePools(pools);
    }
  }, [pools, activeTokenOptions]);

  useEffect(() => {
    if (activePools.length > 0 && filteredPools.length > 0) {
      if (filteredPools.length >= activePools.length) {
        setPoolsToDisplay(filteredPools.filter((pool) => {
          return activePools.includes(pool);
        }));
      } else {
        setPoolsToDisplay(activePools.filter((pool) => {
          return filteredPools.includes(pool);
        }));
      }
    } else if (filteredPools.length > 0) {
      setPoolsToDisplay(filteredPools);
    }
  }, [filteredPools, activePools]);


  /* Calculating the number of applied filters */
  let numberOfFiltersApplied = 0;
  if (activeTokenOptions.length < tokenOptions.length) {
    numberOfFiltersApplied++;
  }
  if (selectedSortByOption.value !== 'default') {
    numberOfFiltersApplied++;
  }

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
  };

  return (
    <AppPage>
      <div className='flex flex-col gap-6'>
        <Display size='L' weight='semibold'>Aloe's Performance</Display>
        <BrowsePoolsPerformance poolData={pools} />
      </div>
      <div className='flex items-center gap-6'>
        <Display size='L' weight='semibold'>Browse Deployed Pools</Display>
        {numberOfFiltersApplied > 0 && (
          <FilterBadge>
            {numberOfFiltersApplied} {numberOfFiltersApplied === 1 ? 'Filter' : 'Filters'} Applied
          </FilterBadge>
        )}
      </div>
      <div className='py-4 flex flex-row items-center justify-between text-lg'>
        <TextInput
          className='lg:basis-5/12 md:basis-1/2 md:grow-0 sm:basis-0 sm:grow sm:mr-12'
          icon={SearchIcon}
          placeholder='Search by name or symbol'
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <MultiDropdown
          options={tokenOptions}
          activeOptions={activeTokenOptions}
          handleChange={(selectedOptions) => {
            setActiveTokenOptions(selectedOptions);
          }}
          placeholder='All Tokens'
          selectedText='Tokens'
        />
        <DropdownWithPlaceholder
          options={sortByOptions}
          selectedOption={selectedSortByOption}
          onSelect={(option: DropdownOption) => {
            setSelectedSortByOption(option);
          }}
          placeholder='Sort By'
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
            {poolsToDisplay.map((pool, index, array) => {
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
