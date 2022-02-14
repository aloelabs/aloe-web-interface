import React, { MouseEventHandler, useState } from 'react';
import AppPage from '../components/common/AppPage';
import PageHeading from '../components/common/PageHeading';
import PortfolioScreenshot from '../assets/png/PorfolioPagePreview.png';
import styled from 'styled-components';
import tw from 'twin.macro';

const StyledImgWrapper = styled.div`
  position: relative;
  display: inline-block;

  border-radius: 8px;
  overflow: hidden;

  ::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: inline-block;
    background: linear-gradient(
      100.12deg,
      #c08fff5a -34.33%,
      #6ccfe41a 60.51%,
      #88e2a11a 117.32%
    );
    box-shadow: 0 30px 40px 10px #3e5a6f;
  }
`;

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

  const scale = 2;

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

  border-radius: 8px;

  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);

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

export default function PortfolioPage() {
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
    <AppPage>
      <PageHeading>Coming&nbsp;Soon...</PageHeading>
      <ul className='list-disc pl-4 font-normal text-grey-600 text-md'>
        <li>View all your LP positions in one place</li>
        <li>One-click migration from other services</li>
        <li>Portfolio performance tracking</li>
      </ul>

      <div className='flex flex-col items-center justify-center mt-12'>
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
            <StyledImgWrapper className=''>
              <img
                src={PortfolioScreenshot}
                alt='Portfolio page preview'
                className='h-auto w-auto object-contain'
              />
            </StyledImgWrapper>
          </Card>
        </CardContainer>
      </div>
    </AppPage>
  );
}
