import React, { useEffect, useState } from 'react';
import BlendGraph from '../graph/BlendGraph';
import {
  add,
  differenceInDays,
  subDays,
  subMinutes,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns/esm';
import styled from 'styled-components';
import tw from 'twin.macro';
import GraphButtons, { buttonIdxToText } from '../graph/GraphButtons';
import axios from 'axios';
import {
  calculateReturns,
  PoolReturns,
  TokenReturns,
} from '../../util/ReturnsCalculations';
import { BlendPoolMarkers } from '../../data/BlendPoolMarkers';
import { GetTokenData } from '../../data/TokenData';

const generateData = (
  from: Date,
  to: Date,
  base1: number,
  base2: number,
  base3: number
) => {
  let difference = differenceInDays(to, from);
  let interval = {};
  if (difference <= 1) {
    interval = { minutes: 15 };
  } else if (difference <= 7) {
    interval = { hours: 3 };
  } else if (difference <= 31) {
    interval = { hours: 8 };
  } else if (difference <= 31 * 3) {
    interval = { days: 1 };
  } else if (difference <= 367) {
    interval = { weeks: 1 };
  } else {
    interval = { months: 1 };
  }
  let data = [];
  let currentDate = from;
  while (currentDate <= to) {
    base1 += Math.random() * 0.3 * Math.pow(-1, Math.ceil(Math.random() * 2));
    base2 += Math.random() * 0.3 * Math.pow(-1, Math.ceil(Math.random() * 2));
    base3 += Math.random() * 0.3 * Math.pow(-1, Math.ceil(Math.random() * 2));
    base1 = Math.abs(base1);
    base2 = Math.abs(base2);
    base3 = Math.abs(base3);
    data.push({
      'Total Returns': base1,
      'Uniswap V2': base2,
      '50/50 HODL': base3,
      x: currentDate.toISOString(),
    });
    currentDate = add(currentDate, interval);
  }
  return data;
};

const GraphButtonsWrapper = styled.div`
  ${tw`w-max`}
  position: absolute;
  top: -36px;
  right: 0;
`;

export type GraphButtonProps = {
  idx: number;
  text: string;
  active: boolean;
  handleClick: any;
};

const Wrapper = styled.div`
  ${tw`flex flex-row items-center justify-start`}
  position: relative;
  height: 372px;
  margin-bottom: 64px;
`;

const Container = styled.div`
  ${tw`flex flex-col items-center justify-start`}
  width: 100%;
`;

function makeRequest(reqUrl: string) {
  return axios.get(reqUrl, {
    timeout: 10000,
  });
}

const poolMatcher = (pool: string) => {
  switch (pool) {
    case '0x0b76abb170519c292da41404fdc30bb5bef308fc':
      return '0x0B76ABb170519C292da41404fDc30Bb5BEf308Fc';
    case '0x021016fbb4d3aaeaa440508c5e06ce8c1039fccd':
      return '0x021016FbB4d3AAeaA440508C5E06Ce8c1039FCCD';
    case '0xe801c4175a0341e65dfef8f3b79e1889047afebb':
      return '0xE801c4175A0341e65dFef8F3B79e1889047AfEbb';
    case '0x37dc6fcb5c03d46b097b094785c9fa557aa32fd4':
      return '0x37dc6FCb5C03d46b097B094785c9fA557aa32fd4';
    default:
      return pool;
  }
};

const tokenMatcher = (token: string) => {
  switch (token) {
    case '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2':
      return '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
    default:
      return token;
  }
};

export type BlendAllocationGraphProps = {
  poolData: BlendPoolMarkers;
};

export default function BlendAllocationGraph(props: BlendAllocationGraphProps) {
  const { poolData } = props;
  const [activeButton, setActiveButton] = useState(0);
  const now = new Date(1651632134000);
  const [fromDate, setFromDate] = useState(subDays(now, 1));
  const [toDate, setToDate] = useState(now);
  const [graphLoading, setGraphLoading] = useState(true);
  const [graphEmpty, setGraphEmpty] = useState(false);
  const [graphError, setGraphError] = useState(false);

  const token0Address = poolData.token0Address.toLowerCase();
  const token1Address = poolData.token1Address.toLowerCase();
  const token0Ticker = GetTokenData(token0Address).ticker;
  const token1Ticker = GetTokenData(token1Address).ticker;
  const token0Key = `${token0Ticker} Price`;
  const token1Key = `${token1Ticker} Price`;
  const initialData = [
    {
      'Total Returns': 0,
      'Uniswap V2': 0,
      x: fromDate.toISOString(),
    },
    {
      'Total Returns': 0,
      'Uniswap V2': 0,
      x: toDate.toISOString(),
    },
  ] as any[];
  initialData[0][token0Key] = 0;
  initialData[0][token1Key] = 0;
  initialData[1][token0Key] = 0;
  initialData[1][token1Key] = 0;
  const [data, setData] = useState(initialData);

  const handleClick = (key: number) => {
    setGraphLoading(true);
    setActiveButton(key);
    let now = new Date(1651632134000);
    switch (key) {
      case 0:
        setFromDate(subDays(now, 1));
        setToDate(now);
        break;
      case 1:
        setFromDate(subWeeks(now, 1));
        setToDate(now);
        break;
      case 2:
        setFromDate(subMonths(now, 1));
        setToDate(now);
        break;
      case 3:
        setFromDate(subMonths(now, 3));
        setToDate(now);
        break;
      case 4:
        setFromDate(subYears(now, 1));
        setToDate(now);
        break;
      case 5:
        setFromDate(subYears(now, 5));
        setToDate(now);
        break;
      default:
        break;
    }
  };

  const pool = poolMatcher(poolData.poolAddress); //'0x0B76ABb170519C292da41404fDc30Bb5BEf308Fc';//'0x33cB657E7fd57F1f2d5f392FB78D5FA80806d1B4';//'0xE801c4175A0341e65dFef8F3B79e1889047AfEbb';
  const token0 = tokenMatcher(token0Address); //'0x956f47f50a910163d8bf957cf5846d573e7f87ca';//'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';//'0x2260fac5e5542a773aa44fbcfedf7c193bc2c599';
  const token1 = tokenMatcher(token1Address); //'0xc7283b66eb1eb5fb86327f08e1b5816b0720212b';//'0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      const getPoolReturns = makeRequest(
        `http://34.94.221.78:3000/pool_returns/${pool}/1/${buttonIdxToText(
          activeButton
        ).toLowerCase()}/${(subMinutes(toDate, 2).getTime() / 1000).toFixed(0)}`
      );
      const getToken0 = makeRequest(
        `http://34.94.221.78:3000/token_returns/${token0}/1/${buttonIdxToText(
          activeButton
        ).toLowerCase()}/${(subMinutes(toDate, 2).getTime() / 1000).toFixed(0)}`
      );
      const getToken1 = makeRequest(
        `http://34.94.221.78:3000/token_returns/${token1}/1/${buttonIdxToText(
          activeButton
        ).toLowerCase()}/${(subMinutes(toDate, 2).getTime() / 1000).toFixed(0)}`
      );
      axios.all([getPoolReturns, getToken0, getToken1]).then(
        axios.spread((poolReturns, token0, token1) => {
          if (mounted) {
            const poolReturnsData = poolReturns.data as PoolReturns;
            let token0Data = token0.data as TokenReturns;
            const token1Data = token1.data as TokenReturns;
            if (token0Data.length === token1Data.length * 2) {
              token0Data = token0Data.filter((_, i) => i % 2 === 0);
            }
            try {
              const calculatedReturns = calculateReturns(
                poolReturnsData,
                token0Data,
                token1Data
              );
              let updatedData = [];
              for (let i = 0; i < calculatedReturns.length; i++) {
                let updatedObj = {} as any;
                updatedObj['Total Returns'] = calculatedReturns[i]['pool'];
                updatedObj['Uniswap V2'] = calculatedReturns[i]['sqrt'];
                updatedObj[token0Key] = calculatedReturns[i]['token0'];
                updatedObj[token1Key] = calculatedReturns[i]['token1'];
                updatedObj['x'] = new Date(
                  calculatedReturns[i]['timestamp']
                ).toISOString();
                updatedData.push(updatedObj);
              }
              setData(updatedData);
              setGraphEmpty(false);
              setGraphError(false);
              setGraphLoading(false);
            } catch (e) {
              setGraphEmpty(true);
              setGraphError(false);
              setGraphLoading(false);
            }
          }
        })
      ).catch((e) => {
        setGraphEmpty(false);
        setGraphError(true);
        setGraphLoading(false);
      });
    }
    fetchData();
    return () => {
      mounted = false;
    };
  }, [
    activeButton,
    toDate,
    fromDate,
    pool,
    token0,
    token1,
    token0Key,
    token1Key,
  ]);

  return (
    <Wrapper>
      <Container>
        <GraphButtonsWrapper>
          <GraphButtons activeButton={activeButton} handleClick={handleClick} />
        </GraphButtonsWrapper>
        {graphLoading && (
          <div>
            <p className='text-center'>
              Loading...
            </p>
          </div>
        )}
        {!graphLoading && graphEmpty && !graphError && (
          <div>
            <p className='text-center'>
              No data available for this period.
            </p>
          </div>
        )}
        {!graphLoading && !graphEmpty && graphError && (
          <div>
            <p className='text-center'>
              There was an error loading the graph. Please try again later.
            </p>
          </div>
        )}
        {!graphLoading && !graphEmpty && !graphError && (
          <BlendGraph
            data={data}
            token0Key={token0Key}
            token1Key={token1Key}
            fromDate={fromDate}
            toDate={toDate}
            tw='mt-16'
          />
        )}
      </Container>
    </Wrapper>
  );
}
