import React from 'react';
import { BlendPoolMarkers } from '../../data/BlendPoolMarkers';
import SiloBlob from '../common/SiloBlob';
import styled from 'styled-components';
import { ResolveBlendPoolDrawData } from '../../data/BlendPoolDataResolver';
import TokenPairLogos from '../common/TokenPairLogos';
import { useNavigate } from 'react-router-dom';

export type BlendPoolSelectTableRowProps = {
  poolData: BlendPoolMarkers;
};

const AnimatedTr = styled.tr`
  transition: all 0.2s ease-in-out;

  cursor: pointer;

  :hover {
    background: linear-gradient(
      100.12deg,
      rgba(159, 84, 255, 0.1) -34.33%,
      rgba(57, 190, 219, 0.1) 60.51%,
      rgba(89, 214, 124, 0.1) 117.32%
    );
    box-shadow: 0 0 16px 0 #44f0ef1f;
    //transform: scale(1.005);
  }
`;

export default function BlendPoolSelectTableRow(
  props: BlendPoolSelectTableRowProps
) {
  const navigate = useNavigate();
  const drawData = ResolveBlendPoolDrawData(props.poolData);

  const { token0Label, token1Label, silo0Label, silo1Label, feeTierText } =
    drawData;

  return (
    <AnimatedTr
      onClick={() => {
        navigate(`../pool/${props.poolData.poolAddress}`);
      }}
    >
      <td className='p-4'>
        {/*<div className='flex flex-row items-center justify-start'>*/}
        {/*  <div className='flex flex-row items-center justify-start -space-x-4 overflow-hidden'>*/}
        {/*    <img className='inline-block h-12 w-12 rounded-full bg-white' alt='' src={token0Img}/>*/}
        {/*    <img className='inline-block h-12 w-12 rounded-full bg-white' alt='' src={token1Img}/>*/}
        {/*  </div>*/}
        {/*  <div className='pl-2'>*/}
        {/*    {token0Label}&nbsp;/&nbsp;{token1Label}*/}
        {/*  </div>*/}
        {/*</div>*/}

        <div className='flex flex-row items-center justify-start'>
          <div className='w-0 md:w-auto'>
            <TokenPairLogos drawData={drawData} />
          </div>
          <div className='pl-4'>
            {token0Label}&nbsp;/&nbsp;{token1Label}
          </div>
        </div>
      </td>
      <td className='p-4'>
        <div className='flex flex-row items-center justify-start'>
          {token0Label}
          <div className='px-2'>
            <SiloBlob>{silo0Label}</SiloBlob>
          </div>
        </div>
      </td>
      <td className='p-4'>
        <div className='flex flex-row items-center justify-start'>
          {token1Label}
          <div className='px-2'>
            <SiloBlob>{silo1Label}</SiloBlob>
          </div>
        </div>
      </td>
      <td className='p-4'>{feeTierText}</td>
      {/* TODO: Add TVL! */}
      {/*<td className='p-4'>$5.0M</td>*/}
    </AnimatedTr>
  );
}
