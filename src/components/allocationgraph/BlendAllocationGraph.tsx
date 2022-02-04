import React from 'react';
import WidgetHeading from '../common/WidgetHeading';

export type BlendAllocationGraphProps = {};

export default function BlendAllocationGraph(props: BlendAllocationGraphProps) {
  return (
    <div className='w-full rounded-md border-2 border-grey-200'>
      <WidgetHeading>Token Allocation</WidgetHeading>
    </div>
  );
}
