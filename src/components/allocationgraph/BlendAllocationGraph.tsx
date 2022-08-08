import React, { useEffect, useState } from 'react';
import BlendGraph from '../graph/BlendGraph';
import { subDays, subMonths, subWeeks, subYears } from 'date-fns/esm';
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
import { Text } from '../common/Typography';
import { fixTimestamp } from '../../util/Dates';
import { API_URL } from '../../data/constants/Values';
import { RESPONSIVE_BREAKPOINT_MD, RESPONSIVE_BREAKPOINT_XS } from '../../data/constants/Breakpoints';
import { BlendGraphPlaceholder } from '../graph/BlendGraphPlaceholder';

const GraphButtonsWrapper = styled.div`
  ${tw`w-max`}
  position: absolute;
  top: -36px;
  right: 0;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_XS}) {
    right: 0;
    left: 0;
    margin-left: auto;
    margin-right: auto;
    max-width: 100%;
  }
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
  margin-top: 32px;
  margin-bottom: 16px;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_MD}) {
    margin-top: 96px;
    margin-bottom: 0;
  }
`;

const Container = styled.div`
  ${tw`flex flex-col items-center justify-start`}
  width: 100%;
`;

// TODO: move this to a separate file
function makeRequest(reqUrl: string) {
  return axios.get(reqUrl, {
    timeout: 10000,
  });
}

export type BlendAllocationGraphProps = {
  poolData: BlendPoolMarkers;
};

export default function BlendAllocationGraph(props: BlendAllocationGraphProps) {
  const { poolData } = props;
  const [activeButton, setActiveButton] = useState(0);
  const now = new Date(Date.now());
  const [fromDate, setFromDate] = useState(subDays(now, 1));
  const [toDate, setToDate] = useState(now);
  const [graphLoading, setGraphLoading] = useState(true);
  const [graphError, setGraphError] = useState(false);

  const token0Address = poolData.token0Address.toLowerCase();
  const token1Address = poolData.token1Address.toLowerCase();
  const token0Ticker = GetTokenData(token0Address).ticker;
  const token1Ticker = GetTokenData(token1Address).ticker;
  const token0Key = `${token0Ticker}`;
  const token1Key = `${token1Ticker}`;
  const initialData = [
    {
      'Pool Returns': 0,
      'Uniswap V2': 0,
      x: fromDate.toISOString(),
    },
    {
      'Pool Returns': 0,
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
    let now = new Date(Date.now());
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

  const pool = poolData.poolAddress.toLowerCase();
  const token0 = token0Address.toLowerCase();
  const token1 = token1Address.toLowerCase();

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      let range = buttonIdxToText(activeButton).toLowerCase();

      const toDateParam = (toDate.getTime() / 1000).toFixed(0);
      const getPoolReturns = makeRequest(
        `${API_URL}/pool_returns/${pool}/1/${range}/${toDateParam}`
      );
      const getToken0 = makeRequest(
        `${API_URL}/token_returns/${token0}/1/${range}/${toDateParam}`
      );
      const getToken1 = makeRequest(
        `${API_URL}/token_returns/${token1}/1/${range}/${toDateParam}`
      );

      axios
        .all([getPoolReturns, getToken0, getToken1])
        .then(
          axios.spread((poolReturns, token0, token1) => {
            const poolReturnsData = poolReturns.data as PoolReturns;
            const token0Data = token0.data as TokenReturns;
            const token1Data = token1.data as TokenReturns;

            try {
              const calculatedReturns = calculateReturns(
                poolReturnsData,
                token0Data,
                token1Data
              );
              let updatedData = [];
              for (let i = 0; i < calculatedReturns.length; i++) {
                let updatedObj = {} as any;
                updatedObj['Blend Pool'] = (calculatedReturns[i]['pool'] - 1.0) * 100;
                updatedObj['Uniswap Baseline'] = (calculatedReturns[i]['sqrt'] - 1.0) * 100;
                // updatedObj['50/50 HODL'] = (calculatedReturns[i]['fifty_fifty'] - 1.0) * 100;
                updatedObj[token0Key] = (calculatedReturns[i]['token0'] - 1.0) * 100;
                updatedObj[token1Key] = (calculatedReturns[i]['token1'] - 1.0) * 100;
                updatedObj['x'] = new Date(
                  fixTimestamp(calculatedReturns[i]['timestamp'].toString())
                ).toISOString();
                updatedData.push(updatedObj);
              }
              if (mounted) {
                setData(updatedData);
                setGraphError(false);
                setGraphLoading(false);
              }
            } catch (e) {
              console.log(e);
              if (mounted) {
                setGraphError(true);
                setGraphLoading(false);
              }
            }
          })
        )
        .catch((e) => {
          console.log(e);
          if (mounted) {
            setGraphError(true);
            setGraphLoading(false);
          }
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
        {graphLoading && <BlendGraphPlaceholder />}
        {!graphLoading && graphError && (
          <Text size='M' weight='medium'>
            There was an error loading the graph. Please try again later.
          </Text>
        )}
        {!graphLoading && !graphError && (
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
