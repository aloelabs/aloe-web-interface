import React from 'react';

export type WithdrawPreviewProps = {
  token0Label: string;
  token1Label: string;

  token0Amount: string;
  token1Amount: string;
};

export default function WithdrawPreview(props: WithdrawPreviewProps) {
  return (
    <div className='w-full flex flex-col items-start justify-center text-md'>
      <div className='w-full text-grey-800'>
        The approximate return will be:
      </div>
      <div className='w-full h-full flex flex-row items-center justify-center'>
        <div className='p-4'>
          <span className='text-grey-600'>{props.token0Amount}</span>
          &nbsp;
          <span className='text-grey-900 font-semibold'>
            {props.token0Label}
          </span>
        </div>
        <div className='h-6 w-0 border-r-2 border-r-grey-400' />
        <div className='p-4'>
          <span className='text-grey-600'>{props.token1Amount}</span>
          &nbsp;
          <span className='text-grey-900 font-semibold'>
            {props.token1Label}
          </span>
        </div>
      </div>
    </div>
  );
}
