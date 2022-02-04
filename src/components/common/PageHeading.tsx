import React from 'react';

export type PageHeadingProps = {
  children?: React.ReactNode;
};

export default function PageHeading(props: PageHeadingProps) {
  return (
    <h1 className='py-2 text-2xl text-left text-grey-1000 font-semibold'>
      {props.children}
    </h1>
  );
}
