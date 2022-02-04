import React from 'react';
import { BlendPoolDrawData } from '../../data/BlendPoolDataResolver';

export type TokenPairLogosProps = {
  drawData: BlendPoolDrawData;
  excludeNames?: boolean;
};

export default function TokenPairLogos(props: TokenPairLogosProps) {
  return (
    <div className='flex flex-row items-center justify-start -space-x-4 overflow-hidden'>
      <img
        className='inline-block h-12 w-12 rounded-full bg-white'
        alt=''
        src={props.drawData.token0Img}
      />
      <img
        className='inline-block h-12 w-12 rounded-full bg-white'
        alt=''
        src={props.drawData.token1Img}
      />
    </div>
  );
}
