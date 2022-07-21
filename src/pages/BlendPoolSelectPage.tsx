import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as PlusIcon } from '../assets/svg/white_plus.svg';
import BrowseCard from '../components/browse/BrowseCard';
import BrowsePoolsPerformance from '../components/browse/BrowsePoolsPerformance';
import { OutlinedGradientRoundedButtonWithIcon } from '../components/common/Buttons';
import {
  DropdownWithPlaceholder,
  DropdownWithPlaceholderOption,
  MultiDropdown,
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

export type BlendPoolSelectPageProps = {
  blockNumber: string | null;
};

export default function BlendPoolSelectPage(props: BlendPoolSelectPageProps) {
  const { blockNumber } = props;
  const [poolsLoading, setPoolsLoading] = useState(true);
  const [activeLoading, setActiveLoading] = useState(true);
  const [toDisplayLoading, setToDisplayLoading] = useState(true);
  const [searchText, setSearchText] = useState<string>('');
  const [activeSearchText, setActiveSearchText] = useState<string>('');
  const [pools, setPools] = useState<BlendPoolMarkers[]>([]);
  const [filteredPools, setFilteredPools] = useState<BlendPoolMarkers[]>([]);
  const [activePools, setActivePools] = useState<BlendPoolMarkers[]>([]);
  const [poolsToDisplay, setPoolsToDisplay] = useState<BlendPoolMarkers[]>([]);
  const [tokenOptions, setTokenOptions] = useState<MultiDropdownOption[]>([]);
  const [activeTokenOptions, setActiveTokenOptions] = useState<
    MultiDropdownOption[]
  >([]);
  const [page, setPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<10 | 20 | 50 | 100>(10);
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
  ] as DropdownWithPlaceholderOption[];
  const [selectedSortByOption, setSelectedSortByOption] =
    useState<DropdownWithPlaceholderOption>(sortByOptions[0]);

  const isGTMediumScreen = useMediaQuery(RESPONSIVE_BREAKPOINTS.MD);
  const { poolDataMap } = useContext(BlendTableContext);

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    }
  }, []);

  const loadData = useCallback(async () => {
    let poolData = Array.from(poolDataMap.values()) as BlendPoolMarkers[];
    if (isMounted.current) {
      setPools(poolData);
      if (poolData.length > 0) {
        setPoolsLoading(false);
      }
    }
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
    if (isMounted.current) {
      setTokenOptions(tokenOptionData);
      setActiveTokenOptions(tokenOptionData);
    }
  }, [poolDataMap]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (activeSearchText.length > 0 && pools.length > 0) {
      if (isMounted.current) {
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
                return field
                  .toLowerCase()
                  .includes(activeSearchText.toLowerCase());
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
  }, [activeSearchText, pools]);

  useEffect(() => {
    if (activeTokenOptions.length > 0) {
      if (isMounted.current) {
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
      if (filteredPools.length >= activePools.length) {
        if (isMounted.current) {
          setPoolsToDisplay(
            filteredPools.filter((pool) => {
              return activePools.includes(pool);
            })
          );
          setToDisplayLoading(false);
        }
      } else {
        if (isMounted.current) {
          setPoolsToDisplay(
            activePools.filter((pool) => {
              return filteredPools.includes(pool);
            })
          );
        }
      }
      if (isMounted.current) {
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
  }, [filteredPools, activePools, poolsLoading, activeLoading]);

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

  const handleItemsPerPageChange = (itemsPerPage: ItemsPerPage) => {
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
                onIconClick={() => setActiveSearchText(searchText)}
                onEnter={() => setActiveSearchText(searchText)}
              />
            </SearchInputWrapper>
            <DropdownContainer>
              <MultiDropdown
                options={tokenOptions}
                activeOptions={activeTokenOptions}
                handleChange={setActiveTokenOptions}
                placeholder='All Tokens'
                selectedText='Tokens'
              />
              <DropdownWithPlaceholder
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
            poolsToDisplay
              .slice(
                (page - 1) * itemsPerPage,
                (page - 1) * itemsPerPage + itemsPerPage
              )
              .map((pool, index) => {
                return (
                  <BrowseCard
                    blendPoolMarkers={pool}
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
