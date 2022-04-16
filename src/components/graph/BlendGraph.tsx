import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { add, differenceInDays } from 'date-fns';
import 'chartjs-adapter-date-fns';

import {
    Chart as ChartJS,
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
  } from 'chart.js';

ChartJS.register(
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
);

// TODO: possibly average the data points to smooth the graph

const generateData = (from : Date, to : Date, base : number) => {
  // get an array of dates between the two dates with a 10 minute interval
  let difference = differenceInDays(to, from);
  let interval = {};
  if (difference === 1) {
    interval = { minutes: 30 };
  } else if (difference === 7) {
      interval = { hours: 6 };
  } else if (difference >= 28 && difference <= 31) {
      interval = { hours: 12 };
  } else if (difference >= 364 && difference <= 367) {
      interval = { weeks: 1 };
  } else if (difference > 367) {
    interval = { months: 1 };
  } else {
      // Shouldn't happen
      interval = { days: 1 };
  }
  let data = [];
  let currentDate = from;
  while (currentDate <= to) {
    base += Math.random() * 0.3;
    base -= Math.random() * 0.3;
    base = Math.abs(base);
    data.push({'y': base, 'x': currentDate.toISOString()});
    
    currentDate = add(currentDate, interval);
  }
  return data;
}

export type BlendGraphProps = {
    options: any,
    fromDate: Date,
    toDate: Date,
};

export default function BlendGraph(props: BlendGraphProps) {
  const [gradient, setGradient] = useState<CanvasGradient | undefined>(undefined);
  useEffect(() => {
    let chart = ChartJS.getChart('chart');
    if (chart) {
      let tempGradient = chart.ctx.createLinearGradient(0, 0, 0, chart.chartArea.bottom);
      tempGradient.addColorStop(0, "rgba(89, 214, 124, 0.5)");
      tempGradient.addColorStop(0.5, "rgba(89, 214, 124, 0.25)");
      tempGradient.addColorStop(1, "rgba(89, 214, 124, 0.05)");
      setGradient(tempGradient);
    }
  }, []);

  let data = {
    datasets: [
      {
        label: 'Total Returns',
        data: generateData(props.fromDate, props.toDate, 6.5),
        borderColor: 'rgb(89, 214, 124)',
        backgroundColor: gradient,
        tension: 0.4,
        pointRadius: 0,
        //cubicInterpolationMode: "monotone" as any,
        pointHoverRadius: 3,
        fill: true,
      },
      {
        label: 'Uniswap V2',
        data: generateData(props.fromDate, props.toDate, 5),
        borderColor: 'rgb(179, 73, 240)',
        backgroundColor: 'rgba(179, 73, 240, 0.1)',
        borderDash: [5, 2],
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 1.5,
        pointHoverRadius: 3,
        fill: false,
      },
      {
        label: '50/50 HODL',
        data: generateData(props.fromDate, props.toDate, 4),
        borderColor: 'rgb(255,255,255)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderDash: [5, 2],
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 1.5,
        pointHoverRadius: 3,
        fill: false,
      },
    ],
  };

  return (
    <div className='w-full'>
      <Line id="chart" options={props.options} data={data} />
    </div>
  );
}
