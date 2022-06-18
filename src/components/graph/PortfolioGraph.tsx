import React, { useEffect, useState } from 'react';
import {
  add,
  differenceInDays,
  parseISO,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns/esm';
import styled from 'styled-components';
import { getEvenlySpacedDates } from '../../util/Dates';
import { Display, Text } from '../common/Typography';
import PortfolioGraphTooltip, { PORTFOLIO_TOOLTIP_WIDTH } from './tooltips/PortfolioGraphTooltip';
import Graph, { getIdealDateFormat, getIdealStep } from './Graph';
import GraphButtons from './GraphButtons';
import { CombinedPercentChange } from '../common/PercentChange';

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

const generatePortfolioGraphData = (from: Date, to: Date) => {
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
  let base1 = 10000;
  let base2 = 5000;
  let data = [];
  let currentDate = from;
  while (currentDate <= to) {
    const newDeposit = Math.random() < 0.025 ? Math.random() * 35000 : 0;
    base1 += Math.random() * 10000 - Math.random() * 5000 + newDeposit;
    base2 += newDeposit
    base1 = Math.abs(base1);
    base2 = Math.abs(base2);
    data.push({
      'Portfolio Value': base1,
      'Net Deposits': base2,
      x: currentDate.toISOString(),
    });
    currentDate = add(currentDate, interval);
  }
  return data;
};

export default function PortfolioGraph() {
  const [activeButton, setActiveButton] = useState(0);
  const now = new Date(Date.now());
  const [fromDate, setFromDate] = useState(subDays(now, 1));
  const [toDate, setToDate] = useState(now);
  const [isTooltipActive, setIsTooltipActive] = useState(false);
  const [data, setData] = useState(
    generatePortfolioGraphData(fromDate, toDate)
  );

  const handleClick = (key: number) => {
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

  useEffect(() => {
    setData(generatePortfolioGraphData(fromDate, toDate));
  }, [fromDate, toDate]);

  const dates = data.map((d: any) => d.x) as string[];
  const numberOfUniqueYears = new Set(
    dates.map((d) => parseISO(d).getFullYear())
  ).size;
  const diffInDays = differenceInDays(toDate, fromDate);
  const step = getIdealStep(diffInDays, numberOfUniqueYears);
  const dateFormat = getIdealDateFormat(diffInDays);
  const ticks = getEvenlySpacedDates(dates, step).slice(1);
  const initialEstimatedValue = data[0]['Portfolio Value'];
  const currentEstimatedValue = data[data.length - 1]['Portfolio Value'];
  const estimatedValueChange = currentEstimatedValue - initialEstimatedValue;
  const estimatedValueChangePercent =
    (estimatedValueChange / initialEstimatedValue) * 100;
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
      {/* <ResponsiveContainer className='absolute bottom-0' height={222.5}>
        <AreaChart
          width={964}
          height={186.5}
          data={data}
          margin={{ top: 0, left: 0, bottom: 0, right: 0 }}
          onMouseEnter={() => {
            if (!isActive) {
              setIsActive(true);
            }
          }}
          onMouseLeave={() => {
            setIsActive(false)
          }}
        >
          <defs>
            <linearGradient
              id='totalReturnsGradient'
              x1='0'
              y1='0'
              x2='0'
              y2='1'
            >
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
            </linearGradient>
          </defs>
          <XAxis
            dataKey='x'
            axisLine={false}
            domain={['auto', 'auto']}
            interval={0}
            ticks={ticks}
            tick={{ fill: TEXT_COLOR, fontSize: '14px' }}
            tickFormatter={(tickString) => 
              format(parseISO(tickString), dateFormat)
            }
            tickLine={false}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={false}
            width={0}
            domain={['auto', 'auto']}
          />
          <Tooltip
            content={isActive ? <PortfolioGraphTooltip /> : <></>}
            allowEscapeViewBox={{ x: true, y: false }}
            isAnimationActive={false}
            position={{ y: -155.83 }}
            offset={-103}
            cursor={isActive ? <CustomCursor /> : <></>}
            active={isActive}
          />
          <Area
            type='monotone'
            dataKey='Portfolio Value'
            stroke={TOTAL_RETURNS_STROKE_COLOR}
            fillOpacity={1}
            fill='url(#totalReturnsGradient)'
            isAnimationActive={false}
            onMouseEnter={() => {
              if (!isActive) {
                setIsActive(true)
              }
            }}
            activeDot={isActive ? { stroke: 'black', strokeWidth: 2, fill: TOTAL_RETURNS_STROKE_COLOR } : <></>}
          />
          <Area
            type='stepAfter'
            dataKey='Net Deposits'
            stroke={isActive ? NET_DEPOSITS_STROKE_COLOR : 'transparent'}
            fillOpacity={0}
            strokeDasharray='5 5'
            isAnimationActive={false}
            onMouseEnter={() => {
              if (!isActive) {
                setIsActive(true)
              }
            }}
            activeDot={isActive ? <CustomizedDot /> : <></>}
          />
        </AreaChart>
      </ResponsiveContainer> */}
    </ResponsiveContainerStyled>
  );
}
