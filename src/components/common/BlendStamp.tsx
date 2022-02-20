import React from 'react';
import { BlendPoolMarkers } from '../../data/BlendPoolMarkers';
import TokenPairLogos from './TokenPairLogos';
import { ResolveBlendPoolDrawData } from '../../data/BlendPoolDataResolver';
import SiloBlob from './SiloBlob';

export type BlendStampProps = {
  poolData: BlendPoolMarkers;
};

export default function BlendStamp(props: BlendStampProps) {
  const drawData = ResolveBlendPoolDrawData(props.poolData);

  return (
    <div className='flex flex-row items-center justify-evenly w-full h-36 bg-grey-75 border-2 rounded-lg border-grey-200'>
      <div className='basis-3/16 flex flex-col items-center justify-evenly flex-initial mx-4'>
        <TokenPairLogos drawData={drawData} excludeNames={true} />
        <div className='border-2 border-grey-200 bg-grey-100 text-md text-grey-1000 rounded-md px-2 py-1 mt-4'>
          {drawData.feeTierText}
        </div>
      </div>
      {/* vertical spacer */}
      <div className=' h-[85%] border-r-2 border-r-grey-200 w-0' />
      <div className='basis-13/16 px-4 flex flex-col items-center justify-evenly'>
        <div className='flex flex-row items-center justify-start my-2'>
          <div className='text-xl'>{drawData.token0Label}</div>
          <div className='px-2'>
            <SiloBlob width='40px' className='text-md'>
              {drawData.silo0Label}
            </SiloBlob>
          </div>
        </div>
        <div className='flex flex-row items-center justify-start my-2'>
          <div className='text-xl'>{drawData.token1Label}</div>
          <div className='px-2 text-center flex items-center justify-center'>
            <SiloBlob width='40px' className='text-md'>
              {drawData.silo1Label}
            </SiloBlob>
          </div>
        </div>
      </div>
    </div>
  );
}
