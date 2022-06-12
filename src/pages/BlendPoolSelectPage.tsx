import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import SearchIcon from '../assets/svg/search.svg';
import BrowseCard from '../components/browse/BrowseCard';
import BrowsePoolsPerformance from '../components/browse/BrowsePoolsPerformance';
import Search from '../components/browse/Search';
import { TertiaryButton } from '../components/common/Buttons';
import {
  DropdownOption,
  DropdownWithPlaceholder,
  MultiDropdown,
  MultiDropdownOption
} from '../components/common/Dropdown';
import { FilterBadge } from '../components/common/FilterBadge';
import { TextInput } from '../components/common/Input';
import Pagination from '../components/common/Pagination';
import { Display } from '../components/common/Typography';
import WideAppPage from '../components/common/WideAppPage';
import { ResolveBlendPoolDrawData } from '../data/BlendPoolDataResolver';
import { BlendPoolMarkers } from '../data/BlendPoolMarkers';
import {
  BROWSE_CARD_WIDTH_LG,
  BROWSE_CARD_WIDTH_MD,
  BROWSE_CARD_WIDTH_XL,
  RESPONSIVE_BREAKPOINT_LG,
  RESPONSIVE_BREAKPOINT_MD
} from '../data/constants/Breakpoints';
import { BlendTableContext } from '../data/context/BlendTableContext';
import { GetTokenData } from '../data/TokenData';

const BROWSE_CARD_GAP = '24px';
const MAX_WIDTH_XL =
  parseInt(BROWSE_CARD_WIDTH_XL) * 2 + parseInt(BROWSE_CARD_GAP) + 'px';
const MAX_WIDTH_L =
  parseInt(BROWSE_CARD_WIDTH_LG) * 2 + parseInt(BROWSE_CARD_GAP) + 'px';
const MAX_WIDTH_M =
  parseInt(BROWSE_CARD_WIDTH_MD) * 2 + parseInt(BROWSE_CARD_GAP) + 'px';

const PageWrapper = styled.div`
  min-width: 300px;
  width: 100%;
  /* The width of the 2 cards + the gap between */
  max-width: ${MAX_WIDTH_XL};
  margin: 0 auto;
  @media (max-width: ${RESPONSIVE_BREAKPOINT_LG}) {
    max-width: ${MAX_WIDTH_L};
  }
  @media (max-width: ${RESPONSIVE_BREAKPOINT_MD}) {
    max-width: ${MAX_WIDTH_M};
  }
`;

const BrowseCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${BROWSE_CARD_GAP};
  justify-content: start;
  align-items: center;
`;

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
    },
  ] as DropdownOption[];
  const [selectedSortByOption, setSelectedSortByOption] =
    useState<DropdownOption>(sortByOptions[0]);

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
      setFilteredPools(
        pools.filter((pool) => {
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
        })
      );
    } else if (pools.length > 0) {
      setFilteredPools(pools);
    }
  }, [searchText, pools]);

  useEffect(() => {
    if (activeTokenOptions.length > 0) {
      setActivePools(
        pools.filter((pool) => {
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
              return activeTokenOptions
                .map((option) => option.label.toLowerCase())
                .includes(field.toLowerCase());
            }) !== -1
          );
        })
      );
    } else if (pools.length > 0) {
      setActivePools(pools);
    }
  }, [pools, activeTokenOptions]);

  useEffect(() => {
    if (activePools.length > 0 && filteredPools.length > 0) {
      if (filteredPools.length >= activePools.length) {
        setPoolsToDisplay(
          filteredPools.filter((pool) => {
            return activePools.includes(pool);
          })
        );
      } else {
        setPoolsToDisplay(
          activePools.filter((pool) => {
            return filteredPools.includes(pool);
          })
        );
      }
    } else {
      setPoolsToDisplay([]);
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
    <WideAppPage>
      <PageWrapper>
        <div className='flex flex-col gap-6'>
          <Display size='L' weight='semibold'>
            Aloe's Performance
          </Display>
          <BrowsePoolsPerformance poolData={pools} />
        </div>
        <div className='flex items-center gap-6'>
          <Display size='L' weight='semibold'>
            Browse Deployed Pools
          </Display>
          {numberOfFiltersApplied > 0 && (
            <FilterBadge>
              {numberOfFiltersApplied}{' '}
              {numberOfFiltersApplied === 1 ? 'Filter' : 'Filters'} Applied
            </FilterBadge>
          )}
        </div>
        <div className='py-4 flex flex-row items-center justify-between text-lg'>
          <div className='flex gap-x-4'>
            <Search value={searchText} onChange={(e) => setSearchText(e.target.value)} />

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
          </div>
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
        <BrowseCards>
          {poolsToDisplay.map((pool, index) => {
            return <BrowseCard blendPoolMarkers={pool} key={index} />;
          })}
        </BrowseCards>
        <Pagination
          currentPage={page}
          itemsPerPage={itemsPerPage}
          totalItems={100}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </PageWrapper>
    </WideAppPage>
  );
}
