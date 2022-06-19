import axios from 'axios';
import {
  closestTo,
  differenceInDays,
  parseISO,
  subDays,
  subMinutes,
  subMonths,
  subWeeks,
  subYears
} from 'date-fns/esm';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getEvenlySpacedDates } from '../../util/Dates';
import { CombinedPercentChange } from '../common/PercentChange';
import { Display, Text } from '../common/Typography';
import Graph, { getIdealDateFormat, getIdealStep } from './Graph';
import GraphButtons, { buttonIdxToText } from './GraphButtons';
import PortfolioGraphTooltip, { PORTFOLIO_TOOLTIP_WIDTH } from './tooltips/PortfolioGraphTooltip';

const TEXT_COLOR = '#82a0b6';
const TOTAL_RETURNS_GRADIENT_COLOR = '#59d67c';
const TOTAL_RETURNS_STROKE_COLOR = '#00C143';
const NET_DEPOSITS_STROKE_COLOR = '#ccdfed';

const InfoContainer = styled.div.attrs(
  (props: { blur?: boolean}) => props
)`
  opacity: ${(props) => props.blur ? 0.2 : 1};
  position: absolute;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  padding-left: 96px;

  @media (max-width: 1024px) {
    padding-left: 32px;
  }

  @media (max-width: 768px) {
    padding-left: 16px;
  }
`;

const ResponsiveContainerStyled = styled.div`
  position: relative;
  left: -80px;
  width: calc(100% + 160px);
  height: 384px;
  overflow: hidden;

  @media (max-width: 1024px) {
    left: -24px;
    width: calc(100% + 48px);
  }
`;

const GraphButtonsWrapper = styled.div.attrs(
  (props: { blur: boolean }) => props
)`
  position: absolute;
  top: 6px;
  right: 88px;
  opacity: ${(props: any) => (props.blur ? 0.2 : 1)};

  @media (max-width: 1024px) {
    right: 32px;
  }

  @media (max-width: 768px) {
    right: 16px;
  }
`;

const ValueAndChangeContainer = styled.div`
  display: flex;
  column-gap: 17px;
  align-items: center;

  @media (max-width: 1020px) {
    flex-direction: column;
    align-items: flex-start;
    row-gap: 8px;
  }
`;

const CustomCursor = (props: any) => {
  const { points } = props;
  const { x, y } = points[0];
  return (
    <line
      fill='none'
      stroke={NET_DEPOSITS_STROKE_COLOR}
      strokeDasharray='5'
      strokeDashoffset={4}
      y1={25 - y}
      y2={190 - y}
      x1={x}
      x2={x}
      strokeWidth={1}
      height={140}
    />
  );
};

function TotalReturnsDot(props: any) {
  const { cx, cy } = props;
  return <circle cx={cx} cy={cy} r={4} fill={TOTAL_RETURNS_STROKE_COLOR} />;
}

function NetReturnsDot(props: any) {
  const { cx, cy } = props;
  return (
    <rect
      x={cx - 4}
      y={cy - 4}
      width={8}
      height={8}
      strokeLinejoin='round'
      stroke='black'
      strokeWidth={2}
      fill={NET_DEPOSITS_STROKE_COLOR}
      className='recharts-dot'
    />
  );
}

function makeRequest(reqUrl: string) {
  return axios.get(
    reqUrl,
    {
      timeout: 10000,
    }
  );
}

export default function PortfolioGraph() {
  const [activeButton, setActiveButton] = useState(0);
  const now = new Date(1651632134000);
  const [fromDate, setFromDate] = useState(subWeeks(now, 2));
  const [toDate, setToDate] = useState(subWeeks(now, 1));
  const [isTooltipActive, setIsTooltipActive] = useState(false);
  const [data, setData] = useState(
    [{ 'Portfolio Value': 0, 'Net Deposits': 0, x: fromDate.toISOString() },
    { 'Portfolio Value': 0, 'Net Deposits': 0, x: toDate.toISOString() }]
  );

  const handleClick = (key: number) => {
    setActiveButton(key);
    let now = new Date(1651632134000);
    now = subWeeks(now, 1);
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

  useEffect(() => {
    let mounted = true;
    const fetchPoolStats = async () => {
      axios.all(
        [
          
        ]
      )
      // const shareBalancesResponse = await axios.get(
      //   // `http://34.94.221.78:3000/share_balances/0x74d92d4bd54123271c841e363915f7d8758e59e7/1/${buttonIdxToText(activeButton).toLowerCase()}/1651632134`
      //   `http://34.94.221.78:3000/share_balances/0x74d92d4bd54123271c841e363915f7d8758e59e7/1/${buttonIdxToText(activeButton).toLowerCase()}/${(subMinutes(toDate, 2).getTime()/1000).toFixed(0)}`
      // );
      // // const netDepositsResponse = await axios.get(
      // //   `http://34.94.221.78:3000/net_deposits/0x74d92d4bd54123271c841e363915f7d8758e59e7/1/${buttonIdxToText(activeButton).toLowerCase()}/1651632134`
      // // );
      // const poolResponse = await axios.get(
      //   `http://34.94.221.78:3000/pool_returns/0xE801c4175A0341e65dFef8F3B79e1889047AfEbb/1/${buttonIdxToText(activeButton).toLowerCase()}/${(subMinutes(toDate, 2).getTime()/1000).toFixed(0)}`
      // );
      // const wbtcResponse = await axios.get(
      //   `http://34.94.221.78:3000/token_returns/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599/1/${buttonIdxToText(activeButton).toLowerCase()}/${(subMinutes(toDate, 2).getTime()/1000).toFixed(0)}`
      // );
      // const wethResponse = await axios.get(
      //   `http://34.94.221.78:3000/token_returns/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/1/${buttonIdxToText(activeButton).toLowerCase()}/${(subMinutes(toDate, 2).getTime()/1000).toFixed(0)}`
      // );
      const getShareBalances = makeRequest(
        `http://34.94.221.78:3000/share_balances/0x74d92d4bd54123271c841e363915f7d8758e59e7/1/${buttonIdxToText(activeButton).toLowerCase()}/${(subMinutes(toDate, 2).getTime()/1000).toFixed(0)}`
      );
      // const netDepositsResponse = await axios.get(
      //   `http://34.94.221.78:3000/net_deposits/0x74d92d4bd54123271c841e363915f7d8758e59e7/1/${buttonIdxToText(activeButton).toLowerCase()}/1651632134`
      // );
      const getPool = makeRequest(
        `http://34.94.221.78:3000/pool_returns/0xE801c4175A0341e65dFef8F3B79e1889047AfEbb/1/${buttonIdxToText(activeButton).toLowerCase()}/${(subMinutes(toDate, 2).getTime()/1000).toFixed(0)}`
      );
      const getWbtc = makeRequest(
        `http://34.94.221.78:3000/token_returns/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599/1/${buttonIdxToText(activeButton).toLowerCase()}/${(subMinutes(toDate, 2).getTime()/1000).toFixed(0)}`
      );
      const getWeth = makeRequest(
        `http://34.94.221.78:3000/token_returns/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/1/${buttonIdxToText(activeButton).toLowerCase()}/${(subMinutes(toDate, 2).getTime()/1000).toFixed(0)}`
      );
      axios.all([getShareBalances, getPool, getWbtc, getWeth]).then(axios.spread((shareBalancesResponse, poolResponse, wbtcResponse, wethResponse) => {
        const shareBalanaces = shareBalancesResponse.data;
        // const netDeposits = netDepositsResponse.data;
        const poolReturns = poolResponse.data;
        const wbtcReturns = wbtcResponse.data;
        const wethReturns = wethResponse.data;
        if (mounted) {
          let totalSupplyData = {} as any;
          let portfolioData = [];
          const shareBalancesKeys = Object.keys(shareBalanaces);
          // const netDepositsKeys = Object.keys(netDeposits);
          for (let i = 0; i < poolReturns.length; i++) {
            const poolReturn = poolReturns[i];
            const wbtcReturn = wbtcReturns[i];
            const wethReturn = wethReturns[i];
            const timestamp = poolReturn.timestamp;
            totalSupplyData[new Date(timestamp).toISOString()] = {
              value: (poolReturn.inventory0 * wbtcReturn.price + poolReturn.inventory1 * wethReturn.price),
              supply: poolReturn.total_supply,
            };
          }
          const dates = Object.keys(totalSupplyData);
          for (let i = 0; i < shareBalancesKeys.length; i++) {
            const shareBalancesKey = shareBalancesKeys[i];
            // const netDepositsKey = netDepositsKeys[i];
            const shareBalancesValue = shareBalanaces[shareBalancesKey];
            // const netDepositsValue = netDeposits[netDepositsKey];
            for (let j = 0; j < shareBalancesValue.length; j++) {
              const timestamp = shareBalancesValue[j].timestamp * 1000;
              const date = new Date(timestamp);
              const closestDate = closestTo(date, dates.map((d) => new Date(d)));
              if (closestDate) {
                const obj = totalSupplyData[closestDate.toISOString()];
                const percentOwned = shareBalancesValue[j].balance / obj.supply;
                portfolioData.push({
                  'Portfolio Value': percentOwned * obj.value,
                  'Net Deposits': 0,//netDepositsValue[j].net_deposit,
                  x: new Date(timestamp).toISOString(),
                });
              }
            }
          }
          setData(portfolioData);
        }
      }));
    };
    fetchPoolStats();
    return () => {
      mounted = false;
    };
  }, [activeButton, toDate]);

  const dates = data.map((d: any) => d.x) as string[];
  const updatedTo = new Date(dates[dates.length - 1]);
  const updatedFrom = new Date(dates[0]);
  const numberOfUniqueYears = new Set(
    dates.map((d) => parseISO(d).getFullYear())
  ).size;
  const diffInDays = differenceInDays(updatedTo, updatedFrom);
  const step = getIdealStep(diffInDays, numberOfUniqueYears);
  const dateFormat = getIdealDateFormat(diffInDays);
  const ticks = getEvenlySpacedDates(dates, step).slice(1);
  const initialEstimatedValue = data[0]['Portfolio Value'];
  const currentEstimatedValue = data[data.length - 1]['Portfolio Value'];
  const estimatedValueChange = currentEstimatedValue - initialEstimatedValue;
  const estimatedValueChangePercent =
    (estimatedValueChange / initialEstimatedValue) * 100 || 0;
  return (
    <ResponsiveContainerStyled>
      <InfoContainer
        blur={isTooltipActive}
      >
        <Text size='XL' weight='medium' color='rgba(130, 160, 182, 1)'>
          Estimated Value
        </Text>
        <ValueAndChangeContainer>
          <Display size='XL' weight='semibold' color='rgba(255, 255, 255, 1)'>
            {currentEstimatedValue.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}{' '}
            USD
          </Display>
          <CombinedPercentChange
            value={estimatedValueChange}
            percent={estimatedValueChangePercent}
          />
        </ValueAndChangeContainer>
      </InfoContainer>
      <GraphButtonsWrapper blur={isTooltipActive}>
        <GraphButtons activeButton={activeButton} handleClick={handleClick} />
      </GraphButtonsWrapper>
      <Graph
        data={data}
        containerHeight={222.5}
        containerClassName='absolute bottom-0'
        charts={[
          {
            type: 'monotone',
            dataKey: 'Portfolio Value',
            stroke: TOTAL_RETURNS_STROKE_COLOR,
            fillOpacity: 1,
            fill: 'url(#totalReturnsGradient)',
            activeDot: <TotalReturnsDot />,
          },
          {
            type: 'stepAfter',
            dataKey: 'Net Deposits',
            stroke: isTooltipActive ? NET_DEPOSITS_STROKE_COLOR : 'transparent',
            fill: 'none',
            fillOpacity: 0,
            strokeDasharray: '5 5',
            activeDot: <NetReturnsDot />,
          },
        ]}
        dateFormat={dateFormat}
        ticks={ticks}
        tickTextColor={TEXT_COLOR}
        linearGradients={[
          <linearGradient id='totalReturnsGradient' x1='0' y1='0' x2='0' y2='1'>
            <stop
              offset='-29%'
              stopColor={TOTAL_RETURNS_GRADIENT_COLOR}
              stopOpacity={0.25}
            />
            <stop
              offset='99.93%'
              stopColor={TOTAL_RETURNS_GRADIENT_COLOR}
              stopOpacity={0}
            />
          </linearGradient>,
        ]}
        CustomTooltip={<PortfolioGraphTooltip />}
        tooltipPosition={{ x: undefined, y: -155.83 }}
        tooltipOffset={-(PORTFOLIO_TOOLTIP_WIDTH / 2)}
        tooltipCursor={<CustomCursor />}
        setIsActive={setIsTooltipActive}
        allowEscapeViewBoxX={true}
      />
    </ResponsiveContainerStyled>
  );
}
