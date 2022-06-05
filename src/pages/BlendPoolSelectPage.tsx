import React, { useContext, useState } from 'react';
import { TertiaryButton } from '../components/common/Buttons';
import { BlendPoolMarkers } from '../data/BlendPoolMarkers';
import EllipsesIcon from '../assets/svg/more_ellipses.svg';
import LeftArrow from '../assets/svg/left_arrow.svg';
import RightArrow from '../assets/svg/right_arrow.svg';
import BlendPoolSelectTableRow from '../components/poolselect/BlendPoolSelectTableRow';
import { TextInput } from '../components/common/Input';
import SearchIcon from '../assets/svg/search.svg';
import WideAppPage from '../components/common/WideAppPage';
import PageHeading from '../components/common/PageHeading';
import { BlendTableContext } from '../data/context/BlendTableContext';
import { ResolveBlendPoolDrawData } from '../data/BlendPoolDataResolver';
import BrowseCard from '../components/browse/BrowseCard';
import styled from 'styled-components';
import {
  BROWSE_CARD_WIDTH_LG,
  BROWSE_CARD_WIDTH_MD,
  BROWSE_CARD_WIDTH_XL,
  RESPONSIVE_BREAKPOINT_LG,
  RESPONSIVE_BREAKPOINT_MD,
} from '../data/constants/Breakpoints';
import Pagination from '../components/common/Pagination';
import BrowsePoolsPerformance from '../components/browse/BrowsePoolsPerformance';
import AppPage from '../components/common/AppPage';

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

const BrowseTitle = styled.span`
  font-size: 32px;
  font-weight: 600;
  line-height: 40px;
`;

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
    <WideAppPage>
      <PageWrapper>
        <div className='flex flex-col gap-6'>
          <BrowseTitle>Aloe's Performance</BrowseTitle>
          <BrowsePoolsPerformance poolData={pools} />
        </div>
        <PageHeading>Browse Deployed Pools</PageHeading>
        <div className='flex justify-between mt-8 mb-8'>
          <TextInput
            className='lg:basis-5/12 md:basis-1/2 md:grow-0 sm:basis-0 sm:grow sm:mr-12'
            icon={SearchIcon}
            placeholder='Search by name, symbol or address'
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
        <BrowseCards>
          {pools.map((pool, index) => {
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
