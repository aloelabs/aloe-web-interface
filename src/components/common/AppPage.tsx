import React, { ReactNode } from 'react';

export type AppPageProps = {
  children?: ReactNode;
};

export default function AppPage(props: AppPageProps) {
  return (
    <div className='flex flex-col items-center justify-center h-full w-full'>
      <div className='w-full pt-10 px-6 lg:px-20 max-w-screen-xl'>
        {props.children}
      </div>
    </div>
  );
}
