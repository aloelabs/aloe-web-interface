import { BigNumber } from '@ethersproject/bignumber';
import axios from 'axios';
import Big from 'big.js';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { useBalance } from 'wagmi';
import { BlendPoolStats } from '../../data/BlendPoolDataResolver';
import { BlendPoolMarkers } from '../../data/BlendPoolMarkers';
import { BLEND_FACTORY_CREATION_BLOCK } from '../../data/constants/Addresses';
import { RESPONSIVE_BREAKPOINT_MD, RESPONSIVE_BREAKPOINT_XS } from '../../data/constants/Breakpoints';
import { API_URL } from '../../data/constants/Values';
import { BlendPoolContext } from '../../data/context/BlendPoolContext';
import { OffChainPoolStats } from '../../data/PoolStats';
import { formatUSDAuto, toBig } from '../../util/Numbers';
import { PoolReturns, TokenReturns } from '../../util/ReturnsCalculations';
import { PercentChange } from '../common/PercentChange';
import { Display, Text } from '../common/Typography';
import WidgetHeading from '../common/WidgetHeading';

const PERFORMANCE_LABEL_TEXT_COLOR = 'rgba(130, 160, 182, 1)';
const PERFORMANCE_VALUE_TEXT_COLOR = 'rgba(255, 255, 255, 1)';

const Wrapper = styled.div`
  ${tw`flex flex-col`}
  width: 100%;
  /* 16px due to the bottom padding already being 8px making the total space 24px */
  gap: 16px;
  margin-bottom: 64px;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_XS}) {
    margin-bottom: 48px;
  }
`;

const PerformanceCardGrid = styled.div`
  display: grid;
  grid-template-columns: calc(50% - 8px) calc(50% - 8px);
  grid-template-rows: 1fr 1fr;
  gap: 16px;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_MD}) {
    grid-template-columns: 1fr;
  }
`;

const PerformanceCard = styled.div`
  ${tw`flex flex-col items-start justify-center`}
  gap: 8px;
  padding: 24px 32px;
  border-radius: 8px;
  background-color: rgba(13, 23, 30, 1);
`;

type AccountStats = {
  accountValue: number,
  accountValue1DAgo: number | null,
  todaysReturn: number | null,
  totalReturn: number | null,
};

type Timestamp = {
  timestamp: string | number;
}

function makeEtherscanRequest(
  fromBlock: number,
  address: string,
  topics: (string | null)[],
  shouldMatchAll: boolean,
  pageLength = 1000,
  page?: number,
  toBlock?: number,
) {
  let query = `https://api.etherscan.io/api?module=logs&action=getLogs`.concat(
    `&fromBlock=${fromBlock.toFixed(0)}`,
    toBlock ? `&toBlock=${toBlock.toFixed(0)}` : '',
    `&address=${address}`
  );
  
  for (let i = 0; i < topics.length; i += 1) {
    if (topics[i] === null) continue;
    query += `&topic${i}=${topics[i]}`;

    if (i === topics.length - 1) break;
    query += `&topic${i}_${i + 1}_opr=${shouldMatchAll ? 'and' : 'or'}`;
  }

  if (page) query += `&page=${page}`;
  query = query.concat(`&offset=${pageLength}`, `&apikey=${process.env.REACT_APP_ETHERSCAN_API_KEY}`);

  return axios.get(query);
}

function findNearestElementByTime<T extends Timestamp>(arr: T[], timestamp: string | number): T {
  const costFunc = arr.map((el) => Math.abs(Number(el.timestamp) - Number(timestamp)));
  const idx = costFunc.reduce((iMin, cost, i, arr) => cost < arr[iMin] ? i : iMin, 0);
  return arr[idx];
}

export type PoolPositionWidgetProps = {
  walletIsConnected: boolean;
  poolData: BlendPoolMarkers;
  offChainPoolStats: OffChainPoolStats | undefined;
  accountAddress: string | undefined;
};

export default function PoolPositionWidget(props: PoolPositionWidgetProps) {

  const { walletIsConnected, poolData, offChainPoolStats, accountAddress } = props;
  const { poolStats } = useContext(BlendPoolContext);

  // const [{ data: accountData }] = useAccount();
  const { data: accountShareBalance } = useBalance({
    addressOrName: accountAddress,
    token: poolData.poolAddress,
    watch: false,
  });

  const [accountStats, setAccountStats] = useState<AccountStats | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchAccountStats(offChainPoolStats: OffChainPoolStats, poolStats: BlendPoolStats, accountShareBalance: any, accountData: any) {
      const tvl = new Big(offChainPoolStats.total_value_locked);
      const accountValue = tvl.mul(toBig(accountShareBalance.value)).div(poolStats.outstandingShares);
      const accountAddress = accountData.slice(2).toLowerCase();

      const getEvents = makeEtherscanRequest(
        BLEND_FACTORY_CREATION_BLOCK,
        poolData.poolAddress,
        [
          null,
          `0x000000000000000000000000${accountAddress}`, // to this user
          `0x000000000000000000000000${accountAddress}` // from this user
        ],
        false, // `or` between topics, not `and`
      );

      const endTime = (Date.now() / 1000).toFixed(0);
      // Get all-time data for "Total Returns"
      const getPoolReturns = axios.get(`${API_URL}/pool_returns/${poolData.poolAddress}/1/all/${endTime}`);
      const getPrices0 = axios.get(`${API_URL}/token_returns/${poolData.token0Address}/1/all/${endTime}`);
      const getPrices1 = axios.get(`${API_URL}/token_returns/${poolData.token1Address}/1/all/${endTime}`);
      // Get 3-month data for "Today's Returns" (we need data from exactly 24 hours ago, and 3m gives us that without as many extraneous entries as 1d)
      const getPoolReturns3M = axios.get(`${API_URL}/pool_returns/${poolData.poolAddress}/1/3m/${endTime}`);
      const getPrices03M = axios.get(`${API_URL}/token_returns/${poolData.token0Address}/1/3m/${endTime}`);
      const getPrices13M = axios.get(`${API_URL}/token_returns/${poolData.token1Address}/1/3m/${endTime}`);

      axios.all([getEvents, getPoolReturns, getPrices0, getPrices1, getPoolReturns3M, getPrices03M, getPrices13M]).then(
        axios.spread((eventData, poolReturnsData, price0Data, price1Data, poolReturnsData3M, price0Data3M, price1Data3M) => {
          const events = eventData.data.result;
          if (!Array.isArray(events)) return;
          const transfers = events.filter((ev: any) => ev.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef');

          let poolReturns = (poolReturnsData.data as PoolReturns).concat(...(poolReturnsData3M.data as PoolReturns));
          poolReturns = poolReturns.filter(r => r.total_supply !== null);
          const prices0 = (price0Data.data as TokenReturns).concat(...(price0Data3M.data as TokenReturns));
          const prices1 = (price1Data.data as TokenReturns).concat(...(price1Data3M.data as TokenReturns));

          const twentyFourHoursAgo = Date.now() / 1000 - 24 * 60 * 60;

          let cashBasis = 0;
          let cashBasis1D = 0;
          let shareDiff1D = 0;

          for (const transfer of transfers) {
            const addrFrom: string = transfer.topics[1].slice(26).toLowerCase();
            const addrTo: string = transfer.topics[2].slice(26).toLowerCase();
            const amountShares = toBig(BigNumber.from(transfer.data)).div('1e18');

            if (addrTo === addrFrom) continue;

            // Search for the nearest pricing data (by timestamp)
            const R = findNearestElementByTime(poolReturns, transfer.timeStamp);
            const P0 = findNearestElementByTime(prices0, transfer.timeStamp);
            const P1 = findNearestElementByTime(prices1, transfer.timeStamp);

            const valueToken0 = amountShares.mul(R.inventory0).div(R.total_supply).mul(P0.price);
            const valueToken1 = amountShares.mul(R.inventory1).div(R.total_supply).mul(P1.price);
            const valueAll = valueToken0.toNumber() + valueToken1.toNumber();

            const isWithin1D = Number(transfer.timeStamp) > twentyFourHoursAgo;
            if (addrTo === accountAddress) {
              cashBasis += valueAll;
              if (isWithin1D) {
                cashBasis1D += valueAll;
                shareDiff1D += amountShares.toNumber();
              };
            } else {
              cashBasis -= valueAll;
              if (isWithin1D) {
                cashBasis1D -= valueAll;
                shareDiff1D -= amountShares.toNumber();
              };
            }
          }

          let accountValue1DAgo: number | null = null;
          {
            const R = findNearestElementByTime(poolReturns, twentyFourHoursAgo);
            const P0 = findNearestElementByTime(prices0, twentyFourHoursAgo);
            const P1 = findNearestElementByTime(prices1, twentyFourHoursAgo);

            const accountShares1DAgo = toBig(accountShareBalance.value).div('1e18').minus(shareDiff1D);
            const valueToken0 = accountShares1DAgo.mul(R.inventory0).div(R.total_supply).mul(P0.price);
            const valueToken1 = accountShares1DAgo.mul(R.inventory1).div(R.total_supply).mul(P1.price);
            accountValue1DAgo = valueToken0.toNumber() + valueToken1.toNumber();
          }

          if (mounted) {
            setAccountStats({
              accountValue: accountValue.toNumber(),
              accountValue1DAgo,
              todaysReturn: accountValue.toNumber() - cashBasis1D - accountValue1DAgo,
              totalReturn: accountValue.toNumber() - cashBasis,
            });
          }
        }
      ));
    }
    if (walletIsConnected && offChainPoolStats && poolStats && accountShareBalance && accountAddress && !accountStats) {
      fetchAccountStats(offChainPoolStats, poolStats, accountShareBalance, accountAddress);
    }
    return () => {
      mounted = false;
    }
  }, [accountAddress, accountShareBalance, accountStats, offChainPoolStats, poolData, poolStats, walletIsConnected]);
  
  if (!walletIsConnected) {
    return null;
  }

  return (
    <Wrapper>
      <WidgetHeading>Your Position</WidgetHeading>
      <PerformanceCardGrid>
        <PerformanceCard>
          <Text size='M' weight='medium' color={PERFORMANCE_LABEL_TEXT_COLOR}>Today's Return</Text>
          <div className='flex items-center gap-4'>
            <Display size='L' weight='semibold' color={PERFORMANCE_VALUE_TEXT_COLOR}>
              {formatUSDAuto(accountStats?.todaysReturn ?? null, '--')}
            </Display>
            <PercentChange percent={
              accountStats && accountStats.todaysReturn && accountStats.accountValue1DAgo
                ? 100 * (accountStats.todaysReturn / accountStats.accountValue1DAgo)
                : 0.0}
            />
          </div>
        </PerformanceCard>
        <PerformanceCard>
          <Text size='M' weight='medium' color={PERFORMANCE_LABEL_TEXT_COLOR}>Total Returns</Text>
          <div className='flex items-center gap-4'>
            <Display size='L' weight='semibold' color={PERFORMANCE_VALUE_TEXT_COLOR}>
              {formatUSDAuto(accountStats?.totalReturn ?? null, '--')}
            </Display>
            {/* <PercentChange percent={0} /> */}
          </div>
        </PerformanceCard>
        <PerformanceCard>
          <Text size='M' weight='medium' color={PERFORMANCE_LABEL_TEXT_COLOR}>Total Value</Text>
          <Display size='L' weight='semibold' color={PERFORMANCE_VALUE_TEXT_COLOR}>
            {formatUSDAuto(accountStats?.accountValue ?? null, '--')}
          </Display>
        </PerformanceCard>
      </PerformanceCardGrid>
    </Wrapper>
  );
}
