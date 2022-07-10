import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { BlendPoolMarkers } from '../../data/BlendPoolMarkers';
import { RESPONSIVE_BREAKPOINT_SM } from '../../data/constants/Breakpoints';
import { API_URL } from '../../data/constants/Values';
import { GlobalStats } from '../../data/GlobalStats';
import { formatUSD } from '../../util/Numbers';
import { Display, Text } from '../common/Typography';

const METRIC_LABEL_TEXT_COLOR = 'rgba(130, 160, 182, 1)';
const METRIC_VALUE_TEXT_COLOR = 'rgba(255, 255, 255, 1)';

const Wrapper = styled.div`
  ${tw`flex p-8 relative`}
  flex-direction: row;
  background-color: rgba(10, 20, 27, 1);
  border-radius: 8px;
  margin-bottom: 48px;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    flex-direction: column;
  }

  &:before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    border-radius: 8px;
    /* 1.25px instead of 1px since it avoids tbe buggy appearance */
    padding: 1.25px;
    background: linear-gradient(90deg, #9baaf3 0%, #7bd8c0 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
`;

const VerticalDivider = styled.div`
  width: 1px;
  margin-left: 32px;
  margin-right: 32px;
  background-color: rgba(43, 64, 80, 1);

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    display: none;
  }
`;

export type BrowsePoolsPerformanceProps = {
  poolData: BlendPoolMarkers[];
};

export default function BrowsePoolsPerformance(
  props: BrowsePoolsPerformanceProps
) {
  const [globalStats, setGlobalStats] = useState<GlobalStats>();

  useEffect(() => {
    let mounted = true;
    const fetchGlobalStats = async () => {
      const res = await axios.get(`${API_URL}/global_stats`);
      const data = res.data[0];
      if (mounted && data) {
        setGlobalStats({
          poolCount: data['pool_count'],
          users: data['users'],
          totalValueLocked: data['total_value_locked'],
        });
      }
    };
    fetchGlobalStats();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Wrapper>
      <div className='flex flex-col gap-3 flex-grow p-4'>
        <Text size='L' weight='medium' color={METRIC_LABEL_TEXT_COLOR}>
          Total Value Managed
        </Text>
        <Display size='L' weight='medium' color={METRIC_VALUE_TEXT_COLOR}>
          {formatUSD(globalStats?.totalValueLocked || null)}
        </Display>
      </div>
      <VerticalDivider />
      <div className='flex flex-col gap-3 flex-grow p-4'>
        <Text size='L' weight='medium' color={METRIC_LABEL_TEXT_COLOR}>
          Pools Deployed
        </Text>
        <Display size='L' weight='medium' color={METRIC_VALUE_TEXT_COLOR}>
          {globalStats?.poolCount || '-'} Pools
        </Display>
      </div>
      <VerticalDivider />
      <div className='flex flex-col gap-3 flex-grow p-4'>
        <Text size='L' weight='medium' color={METRIC_LABEL_TEXT_COLOR}>
          Total Aloe Users
        </Text>
        <Display size='L' weight='medium' color={METRIC_VALUE_TEXT_COLOR}>
          {globalStats?.users || '-'}
        </Display>
      </div>
    </Wrapper>
  );
}
