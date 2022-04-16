import React, { useState } from 'react';
import { SimpleButton } from '../common/Buttons';
import { addHours, subDays, subMonths } from 'date-fns';
import BlendGraph from '../graph/BlendGraph';
import { subWeeks, subYears } from 'date-fns/esm';

export type BlendAllocationGraphProps = {};

export type GraphButtonProps = {
  idx: number,
  text: string,
  active: boolean,
  handleClick: any,
}

const GraphButton = (props: GraphButtonProps) => {
  return (
    <SimpleButton key={props.idx} className={props.active ? 'active' : ''} onClick={props.handleClick}>{props.text}</SimpleButton>
  )
}

const getNearestWeek = (date : Date) => {
  // TODO: check
  let newDate = new Date(date);
  newDate.setDate(newDate.getDate() - newDate.getDay());
  newDate.setHours(0);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
}

const getNearestDay = (date : Date) => {
  let newDate = new Date(date);
  newDate.setHours(0);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
}

const getNearest6Hours = (date : Date) => {
  let newDate = new Date(date);
  if (newDate.getHours() < 6) {
    getNearestDay(newDate);
  }
  newDate.setHours(6 * Math.floor(newDate.getHours() / 6));
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
}

const getNearestHour = (date : Date) => {
  let newDate = new Date(date);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
}

const getNearest30Minutes = (date : Date) => {
  let newDate = new Date(date);
  if (newDate.getMinutes() < 30) {
    return getNearestHour(newDate);
  }
  newDate.setMinutes(30);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
}

export default function BlendAllocationGraph(props: BlendAllocationGraphProps) {
  const [activeButton, setActiveButton] = useState(0);
  const now = getNearest30Minutes(new Date());
  const [fromDate, setFromDate] = useState(subDays(now, 1));
  const [toDate, setToDate] = useState(now);
  const [units, setUnits] = useState({time: { unit: "hour" as string, }});

  //console.log(minTick.toUTCString());

  const handleClick = (key : number) => {
    setActiveButton(key);
    let now = new Date(Date.now());
    switch(key) {
      case 0:
        setUnits({time: { unit: "day" as string, }});
        now = getNearest30Minutes(now);
        setFromDate(subDays(now, 1));
        setToDate(now);
        break;
      case 1:
        setUnits({time: { unit: "week" as string, }});
        now = getNearest6Hours(now);
        setFromDate(subWeeks(now, 1));
        setToDate(now);
        break;
      case 2:
        setUnits({time: { unit: "month" as string, }});
        now = getNearestDay(now);
        setFromDate(subMonths(now, 1));
        setToDate(now);
        break;
      case 3:
        setUnits({time: { unit: "year" as string, }});
        now = getNearestWeek(now);
        setFromDate(subYears(now, 1));
        setToDate(now);
        break;
      case 4:
        setUnits({time: { unit: "year" as string, }});
        now = getNearestWeek(now);
        setFromDate(subYears(now, 5));
        setToDate(now);
        break;
      default:
        break;
    }
  }

  let options = {
    responsive: true,
    animation: false,
    interaction: {
        intersect: false,
        mode: 'nearest',
        axis: 'x'      
    },
    plugins: {
      tooltip: {
        axis: 'x',
        mode: 'nearest',
        intersect: false,
        position: 'nearest',
        backgroundColor: 'rgba(25,25,25,0.8)',
        bodyFont: {
          family: '--apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
          size: 14,
        },
        bodySpacing: 8,
        boxPadding: 4,
        padding: 8,
        displayColors: false,
        callbacks: {
          title: (item : any) => {
            // TODO: clean up this logic
            let labelSplit = item[0].label.split(",");
            return labelSplit[0] + "," + labelSplit[1] + "\n" + labelSplit[2].trim().replace(" p.m.", "PM").replace(" a.m.", "AM");
          },
          labelTextColor: (thing : any) => {
            return thing.dataset.borderColor;
          },
          label: (thing : any) => {
            return `${thing.raw.y.toFixed(2)}%`;
          },
          afterLabel: (thing : any) => {
            return thing.dataset.label;
          },
        },
      },
      legend: {
        position: 'bottom' as const,
        labels: {
            font: {
                size: 10,
                family: '--apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
            },
            color: 'rgb(125, 148, 167)',
        },
      },
      hover: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
        x: {
          display: true,
          source: 'data',
          ticks: {
            font: {
              size: 14,
              family: '--apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
            },
            color: 'rgb(125, 148, 167)',
            autoSkip: true,
            maxRotation: 0,
            maxTicksLimit: 8,
            min: -1,
          },
          grid: {
            lineWidth: 1,

          },
          type: "time" as const,
          units,
        },
        y: {
            display: false,
            ticks: {
              display: false,
              autoSkip: false,
            },
            grid: {
              display: false,
              lineWidth: 1,
            }
        },
    },
  };

  const graphButtons : GraphButtonProps[] = [
    {
      idx: 0,
      text: "1D",
      active: true,
      handleClick: () => handleClick(0),
    },
    {
      idx: 1,
      text: "1W",
      active: false,
      handleClick: () => handleClick(1),
    },
    {
      idx: 2,
      text: "1M",
      active: false,
      handleClick: () => handleClick(2),
    },
    {
      idx: 3,
      text: "1Y",
      active: false,
      handleClick: () => handleClick(3),
    },
    {
      idx: 4,
      text: "ALL",
      active: false,
      handleClick: () => handleClick(4),
    },
  ];

  return (
    <div className='w-full rounded-md'>
      <div className='w-full p-4 flex gap-4 justify-end'>
        {graphButtons.map((props : any) => {
          props.active = props.idx === activeButton;
          return GraphButton(props);//<GraphButton idx={val.idx} text={val.text} active={val.idx === activeButton} handleClick={() => handleClick(val.idx)} />
        })}
      </div>
      <BlendGraph options={options} fromDate={fromDate} toDate={toDate} />
    </div>
  );
}
