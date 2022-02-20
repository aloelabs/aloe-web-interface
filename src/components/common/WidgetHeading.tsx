import React from 'react';

export type WidgetHeadingProps = {
  children?: React.ReactNode;
};

export default function WidgetHeading(props: WidgetHeadingProps) {
  return (
    <h2 className='pb-2 text-xl text-left text-grey-1000 font-semibold'>
      {props.children}
    </h2>
  );
}
