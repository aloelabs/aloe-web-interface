import React, { MouseEventHandler, useState } from 'react';
import { BlendPoolMarkers } from '../../data/BlendPoolMarkers';
import TokenPairLogos from './TokenPairLogos';
import { ResolveBlendPoolDrawData } from '../../data/BlendPoolDataResolver';
import SiloBlob from './SiloBlob';
import styled from 'styled-components';
import tw from 'twin.macro';

export type BlendStampProps = {
  poolData: BlendPoolMarkers;
};

interface MouseMoveData {
  x: number;
  y: number;
  elX: number;
  elY: number;
  elW: number;
  elH: number;
  isActive: boolean;
}

const CardContainer = styled.div`
  perspective: 800px;
  perspective-origin: center;
`;

const Card = styled.div.attrs<MouseMoveData>((props) => {
  const offsetX = props.x - (props.elX + props.elW / 2);
  const offsetY = props.y - (props.elY + props.elH / 2);

  const scale = 6;

  const rotateX = (scale * offsetY * 2) / props.elH;
  const rotateY = (-scale * offsetX * 2) / props.elW;

  let transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  let transition = 'all 0.1s linear';
  if (!props.isActive) {
    transform = 'rotateX(0deg) rotateY(0deg) skewX(0deg) skewY(0deg)';
    transition = 'all 1s ease-in-out';
  }

  return {
    style: {
      transform,
      transition,
    },
  };
})<MouseMoveData>`
  ${tw`h-full w-full`}

  //border: 2px solid rgba(255, 255, 255, 0.3);
  border: 2px solid #4A687F;
  border-radius: 8px;

  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(35px);
  box-shadow: 0 0 80px rgba(0, 0, 0, 0.25);

  user-select: none;
  overflow: hidden;

  transform-origin: center;
`;

const useMove = () => {
  const [state, setState] = useState({
    x: 0,
    y: 0,
    elX: 0,
    elY: 0,
    elW: 0,
    elH: 0,
    isActive: false,
  });

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (e) => {
    const currentTarget = e.currentTarget;
    const boundingRect = currentTarget.getBoundingClientRect();

    setState((state) => {
      const data: MouseMoveData = {
        ...state,
        isActive: true,
        x: e.clientX,
        y: e.clientY,
        elX: boundingRect.x,
        elY: boundingRect.y,
        elW: currentTarget.offsetWidth,
        elH: currentTarget.offsetHeight,
      };

      return data;
    });
  };

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = (e) => {
    setState((state) => ({ ...state, isActive: false }));
  };

  return {
    x: state.x,
    y: state.y,
    elX: state.elX, // X coord of element's top left corner
    elY: state.elY, // Y coord of element's top left corner
    elW: state.elW, // element's width
    elH: state.elH, // element's height
    isActive: state.isActive,
    handleMouseMove,
    handleMouseLeave,
  };
};

export default function BlendStampHolo(props: BlendStampProps) {
  const drawData = ResolveBlendPoolDrawData(props.poolData);
  const {
    x,
    y,
    elX,
    elY,
    elW,
    elH,
    isActive,
    handleMouseMove,
    handleMouseLeave,
  } = useMove();

  return (
    <CardContainer>
      <Card
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        x={x}
        y={y}
        elX={elX}
        elY={elY}
        elW={elW}
        elH={elH}
        isActive={isActive}
      >
        <div className='flex flex-row items-center justify-evenly w-full h-42'>
          <div className='flex flex-col items-center justify-evenly flex-initial mx-2 p-4'>
            <TokenPairLogos drawData={drawData} excludeNames={true} />
            <p className='text-xs text-grey-1000 mt-4 mb-1'>
              Uniswap&nbsp;Fee&nbsp;Tier
            </p>
            <div className='border-2 border-grey-400 rounded-md p-0.5 text-center w-fit'>
              <p className='text-md text-grey-1000'>{drawData.feeTierText}</p>
            </div>
          </div>
          {/* vertical spacer */}
          {/*border-r-[#FFFFFF4D]*/}
          <div className='border-r-2 border-r-grey-400 w-0 h-40' />
          <div className='grow px-8 flex flex-col items-center justify-evenly'>
            {[
              [drawData.token0Label, drawData.silo0Label],
              [drawData.token1Label, drawData.silo1Label],
            ].map((tokenDataPair: string[], index) => {
              return (
                <div
                  key={index}
                  className='flex flex-row items-center justify-start my-2 w-full'
                >
                  <div className='text-xl font-semibold'>
                    {tokenDataPair[0]}
                  </div>
                  <div className='px-2 grow'>
                    {/* color is grey-400 */}
                    <SiloBlob
                      width='40px'
                      className='text-md w-full'
                      color='#4A687F'
                      expand
                    >
                      {tokenDataPair[1]}
                    </SiloBlob>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </CardContainer>
  );
}
