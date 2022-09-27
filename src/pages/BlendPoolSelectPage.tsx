import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as PlusIcon } from '../assets/svg/white_plus.svg';
import BrowseCard from '../components/browse/BrowseCard';
import BrowsePoolsPerformance from '../components/browse/BrowsePoolsPerformance';
import { OutlinedGradientRoundedButtonWithIcon } from '../components/common/Buttons';
import {
  DropdownWithPlaceholderValue,
  DropdownWithPlaceholderValueOption,
  MultiDropdownWithPlaceholder,
  MultiDropdownOption,
} from '../components/common/Dropdown';
import { FilterBadge } from '../components/common/FilterBadge';
import { RoundedInputWithIcon } from '../components/common/Input';
import Pagination, { ItemsPerPage } from '../components/common/Pagination';
import { Display } from '../components/common/Typography';
import WideAppPage from '../components/common/WideAppPage';
import { ResolveBlendPoolDrawData } from '../data/BlendPoolDataResolver';
import { BlendPoolMarkers } from '../data/BlendPoolMarkers';
import {
  BROWSE_CARD_WIDTH_LG,
  BROWSE_CARD_WIDTH_MD,
  BROWSE_CARD_WIDTH_XL,
  RESPONSIVE_BREAKPOINT_LG,
  RESPONSIVE_BREAKPOINT_MD,
  RESPONSIVE_BREAKPOINT_SM,
  RESPONSIVE_BREAKPOINTS,
} from '../data/constants/Breakpoints';
import { BlendTableContext } from '../data/context/BlendTableContext';
import { GetTokenData } from '../data/TokenData';
import { ReactComponent as SearchIcon } from '../assets/svg/search.svg';
import useMediaQuery from '../data/hooks/UseMediaQuery';
import tw from 'twin.macro';
import { BrowseCardPlaceholder } from '../components/browse/BrowseCardPlaceholder';
import { IS_DEV } from '../util/Env';
import { isHiddenPool } from '../data/HiddenBlendPools';
import { isPoolDeprecated } from '../util/Pool';
import { ReactComponent as APYIcon } from '../assets/svg/apy.svg';
import { SortAscendingIcon, SortDescendingIcon } from '@heroicons/react/solid';
import { OffChainPoolStats } from '../data/PoolStats';
import axios, { AxiosResponse } from 'axios';
import { API_URL } from '../data/constants/Values';
import { makeEtherscanRequest } from '../util/Etherscan';
import { BigNumber } from 'ethers';

const FACTORY_ADDRESS = '0x000000000008b34b9C428ddC00f54d49105dA313';
const TOPIC_ZERO =
  '0xfb83ca910097c70646250238daf4abcd392f91992164890d564d81e0e218f2b2';
const BLOCK_TO_SEARCH_FROM = 14128969;

const enum SortOption {
  APY = 'APY',
  NEWEST = 'NEWEST',
  OLDEST = 'OLDEST',
  DEFAULT = 'DEFAULT',
}

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

const InnerSearchBar = styled.div`
  ${tw`flex gap-x-4`}
  width: 100%;
  flex-direction: row;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    flex-direction: column;
    row-gap: 12px;
  }
`;

const BrowseCards = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${BROWSE_CARD_GAP};
  justify-content: start;
  align-items: center;
`;

const SearchInputWrapper = styled.div`
  width: 420px;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    max-width: 420px;
    width: 100%;
    min-width: 300px;
  }
`;

const DropdownContainer = styled.div`
  ${tw`flex flex-row gap-x-4`}
`;

export type IntermediatePoolStatsData = {
  poolData: BlendPoolMarkers;
  poolStats?: OffChainPoolStats;
};

export type PoolStatsData = IntermediatePoolStatsData & {
  timestamp: number;
};

export type BlendPoolSelectPageProps = {
  blockNumber: string | null;
};

export default function BlendPoolSelectPage(props: BlendPoolSelectPageProps) {
  const { blockNumber } = props;
  const [poolsLoading, setPoolsLoading] = useState(true);
  const [activeLoading, setActiveLoading] = useState(true);
  const [toDisplayLoading, setToDisplayLoading] = useState(true);
  const [searchText, setSearchText] = useState<string>('');
  const [pools, setPools] = useState<PoolStatsData[]>([]);
  const [searchablePools, setSearchablePools] = useState<PoolStatsData[]>([]);
  const [filteredPools, setFilteredPools] = useState<PoolStatsData[]>([]);
  const [activePools, setActivePools] = useState<PoolStatsData[]>([]);
  const [poolsToDisplay, setPoolsToDisplay] = useState<PoolStatsData[]>([]);
  const [tokenOptions, setTokenOptions] = useState<MultiDropdownOption[]>([]);
  const [activeTokenOptions, setActiveTokenOptions] = useState<
    MultiDropdownOption[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<10 | 20 | 50 | 100>(10);
  const sortByOptions = [
    {
      label: 'Default',
      value: SortOption.DEFAULT,
      isDefault: true,
    },
    {
      label: 'APY',
      value: SortOption.APY,
      isDefault: false,
      Icon: APYIcon,
    },
    {
      label: 'Newest First',
      value: SortOption.NEWEST,
      isDefault: false,
      Icon: SortDescendingIcon,
    },
    {
      label: 'Oldest First',
      value: SortOption.OLDEST,
      isDefault: false,
      Icon: SortAscendingIcon,
    },
  ] as DropdownWithPlaceholderValueOption[];
  const [selectedSortByOption, setSelectedSortByOption] =
    useState<DropdownWithPlaceholderValueOption>(sortByOptions[0]);

  const isGTMediumScreen = useMediaQuery(RESPONSIVE_BREAKPOINTS.MD);
  const { poolDataMap } = useContext(BlendTableContext);

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadData = useCallback(async () => {
    let poolData = Array.from(poolDataMap.values()) as BlendPoolMarkers[];
    const poolRequests = poolData.map(async (pool) => {
      return {
        poolData: pool,
        poolStats: await axios.get(
          `${API_URL}/pool_stats/${pool.poolAddress}/1`,
          {
            transformResponse: (response) => {
              const responseJSON = JSON.parse(response)[0];
              return responseJSON as OffChainPoolStats;
            },
          }
        ),
      };
    });
    const poolStatsDataResponse = await Promise.all(poolRequests);
    // Fetch the intermediate data (everything except the timestamp)
    // TODO: see if we can move move the timestamp call into the above promise.all
    const intermediatePoolStatsData: IntermediatePoolStatsData[] = poolStatsDataResponse.map(
      (response: {
        poolData: BlendPoolMarkers;
        poolStats: AxiosResponse<any, any>;
      }) => {
        return {
          poolData: response.poolData,
          poolStats: response.poolStats.data,
        };
      }
    );
    // Fetch the timestamps for all the pools
    const factoryCreationEventsRequest = await makeEtherscanRequest(
      BLOCK_TO_SEARCH_FROM,
      FACTORY_ADDRESS,
      [TOPIC_ZERO],
      false
    );
    const poolStatsData = intermediatePoolStatsData.map((poolStats) => {
      const poolCreationEvent = factoryCreationEventsRequest.data.result.find(
        (event: any) => {
          const topic1: string = event.topics[1];
          const currentPoolAddress = `0x${topic1.slice(26)}`;
          return (
            currentPoolAddress.toLowerCase() ===
            poolStats.poolData.poolAddress.toLowerCase()
          );
        }
      );
      const eventTimestamp = poolCreationEvent?.timeStamp;
      const timestamp = eventTimestamp
        ? BigNumber.from(eventTimestamp).toNumber()
        : -1;
      return {
        ...poolStats,
        timestamp,
      };
    });
    // Filter out deprecated pools
    let nonDeprecatedPoolData = poolStatsData.filter(
      (pool) => !isPoolDeprecated(pool.poolData)
    );
    if (isMounted.current) {
      setPools(nonDeprecatedPoolData);
      setSearchablePools(poolStatsData);
      if (poolData.length > 0) {
        setPoolsLoading(false);
      }
    }
    let tokenAddresses = Array.from(
      new Set(
        nonDeprecatedPoolData.flatMap((pool) => [
          pool.poolData.token0Address.toLowerCase(),
          pool.poolData.token1Address.toLowerCase(),
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
    if (isMounted.current) {
      setTokenOptions(tokenOptionData);
      setActiveTokenOptions(tokenOptionData);
    }
  }, [poolDataMap]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (searchText.length > 0 && pools.length > 0) {
      if (isMounted.current) {
        setFilteredPools(
          searchablePools.filter((pool) => {
            const {
              silo0Name,
              silo1Name,
              silo0Label,
              silo1Label,
              token0Label,
              token1Label,
            } = ResolveBlendPoolDrawData(pool.poolData);

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
      }
    } else if (pools.length > 0) {
      if (isMounted.current) {
        setFilteredPools(pools);
      }
    }
  }, [searchText, pools, searchablePools]);

  useEffect(() => {
    if (activeTokenOptions.length > 0) {
      if (isMounted.current) {
        setActivePools(
          pools
            .filter(
              (pool) => IS_DEV || !isHiddenPool(pool.poolData.poolAddress)
            ) // Hide pools that should only be shown in dev mode
            .filter((pool) => {
              const {
                silo0Name,
                silo1Name,
                silo0Label,
                silo1Label,
                token0Label,
                token1Label,
              } = ResolveBlendPoolDrawData(pool.poolData);

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
        setActiveLoading(false);
      }
    } else if (pools.length > 0) {
      if (isMounted.current) {
        setActivePools(pools);
        setActiveLoading(poolsLoading);
      }
    }
  }, [pools, activeTokenOptions, poolsLoading]);

  useEffect(() => {
    if (activePools.length > 0 && filteredPools.length > 0) {
      // Keep track of filtered pools that are deprecated
      const deprecatedPoolsToShow =
        searchText !== ''
          ? filteredPools.filter((pool) => isPoolDeprecated(pool.poolData))
          : [];
      // Only show pools that are in both active and filtered sets
      const intersection = activePools.filter((pool) =>
        filteredPools.includes(pool)
      );
      // Combine the intersection with the deprecated pools that are in the filtered set
      const poolsToShow = intersection.concat(deprecatedPoolsToShow);
      if (isMounted.current) {
        setPoolsToDisplay(poolsToShow);
        setToDisplayLoading(false);
      }
    } else {
      if (isMounted.current) {
        setPoolsToDisplay([]);
        if (!poolsLoading) {
          setToDisplayLoading(activeLoading);
        }
      }
    }
  }, [filteredPools, activePools, poolsLoading, activeLoading, searchText]);

  const sortedPoolsToDisplay = poolsToDisplay.sort((poolA, poolB) => {
    if (selectedSortByOption.value === SortOption.APY) {
      return (
        (poolB.poolStats?.annual_percentage_rate ?? 0) -
        (poolA.poolStats?.annual_percentage_rate ?? 0)
      );
    } else if (selectedSortByOption.value === SortOption.NEWEST) {
      return poolB.timestamp - poolA.timestamp;
    } else if (selectedSortByOption.value === SortOption.OLDEST) {
      return poolA.timestamp - poolB.timestamp;
    } else {
      return (
        (poolB.poolStats?.total_value_locked ?? 0) - (poolA.poolStats?.total_value_locked ?? 0)
      );
    }
  });

  /* Calculating the number of applied filters */
  let numberOfFiltersApplied = 0;
  if (activeTokenOptions.length < tokenOptions.length) {
    numberOfFiltersApplied++;
  }
  if (selectedSortByOption.value !== SortOption.DEFAULT) {
    numberOfFiltersApplied++;
  }

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleItemsPerPageChange = (itemsPerPage: ItemsPerPage) => {
    setItemsPerPage(itemsPerPage);
  };

  const blendPoolData = pools.map((pool) => pool.poolData);

  return (
    <WideAppPage>
      <PageWrapper>
        <div className='flex flex-col gap-6'>
          <Display size='L' weight='semibold'>
            Aloe's Performance
          </Display>
          <BrowsePoolsPerformance poolData={blendPoolData} />
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
        <div className='py-4 flex items-center justify-between'>
          <InnerSearchBar>
            <SearchInputWrapper>
              <RoundedInputWithIcon
                value={searchText}
                size='L'
                onChange={(e) => setSearchText(e.target.value)}
                Icon={<SearchIcon />}
                svgColorType='fill'
                placeholder='Search by name, symbol or address'
                fullWidth={true}
              />
            </SearchInputWrapper>
            <DropdownContainer>
              <MultiDropdownWithPlaceholder
                options={tokenOptions}
                activeOptions={activeTokenOptions}
                handleChange={setActiveTokenOptions}
                placeholder='All Tokens'
                selectedText='Tokens'
              />
              <DropdownWithPlaceholderValue
                options={sortByOptions}
                selectedOption={selectedSortByOption}
                onSelect={setSelectedSortByOption}
                placeholder='Sort By'
              />
            </DropdownContainer>
          </InnerSearchBar>
          {isGTMediumScreen && (
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
          )}
        </div>
        <BrowseCards>
          {toDisplayLoading &&
            [...Array(5)].map((_placeholder, index) => (
              <BrowseCardPlaceholder key={index} />
            ))}
          {!toDisplayLoading &&
            sortedPoolsToDisplay
              .slice(
                (page - 1) * itemsPerPage,
                (page - 1) * itemsPerPage + itemsPerPage
              )
              .map((pool, index) => {
                return (
                  <BrowseCard
                    blendPoolMarkers={pool.poolData}
                    blockNumber={blockNumber}
                    key={index}
                  />
                );
              })}
        </BrowseCards>
        <Pagination
          currentPage={page}
          itemsPerPage={itemsPerPage}
          totalItems={poolsToDisplay.length}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          loading={toDisplayLoading}
        />
      </PageWrapper>
    </WideAppPage>
  );
}
