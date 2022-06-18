import React, { useState } from 'react';
import BlendGraph from '../graph/BlendGraph';
import {
  add,
  differenceInDays,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns/esm';
import styled from 'styled-components';
import tw from 'twin.macro';
import GraphButtons from '../graph/GraphButtons';

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

export type BlendAllocationGraphProps = {};

export default function BlendAllocationGraph(props: BlendAllocationGraphProps) {
  const [activeButton, setActiveButton] = useState(0);
  const now = new Date(Date.now());
  const [fromDate, setFromDate] = useState(subDays(now, 1));
  const [toDate, setToDate] = useState(now);

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

  const data = generateData(fromDate, toDate, 6.5, 5, 4);
  return (
    <Wrapper>
      <Container>
        <GraphButtonsWrapper>
          <GraphButtons activeButton={activeButton} handleClick={handleClick} />
        </GraphButtonsWrapper>
        <BlendGraph data={data} fromDate={fromDate} toDate={toDate} tw='mt-16' />
      </Container>
    </Wrapper>
  );
}
