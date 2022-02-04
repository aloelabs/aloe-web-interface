import React, { useEffect, useRef, useState } from 'react';

export default function Pending() {

  const [periodCount, setPeriodCount] = useState(0);
  const periodCountRef = useRef(periodCount);
  periodCountRef.current = periodCount;

  useEffect(() => {
    const timer = setInterval(() => {
      let nextPeriodCount = periodCountRef.current;
      nextPeriodCount += 1;
      if (nextPeriodCount >= 4) nextPeriodCount = 0;
      setPeriodCount(nextPeriodCount);
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <span>
      Pending{'.'.repeat(periodCount)}
    </span>
  );
}