import React, { ReactNode } from 'react';

export type AppPageProps = {
  children?: ReactNode;
};

export default function AppPage(props: AppPageProps) {
  return (
    <div className='flex flex-col items-center justify-center h-full w-full'>
      <div className='w-full py-16 px-6 lg:px-20'>
        {props.children}
      </div>
    </div>
  );
}
