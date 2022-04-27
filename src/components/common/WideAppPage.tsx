import React, { ReactNode } from 'react';

export type WideAppPageProps = {
  children?: ReactNode;
};

export default function WideAppPage(props: WideAppPageProps) {
  return (
    <div className='flex flex-col items-center justify-center h-full w-full'>
      <div className='w-full pt-10 px-6 lg:px-20 max-w-screen-2xl'>
        {props.children}
      </div>
    </div>
  );
}
