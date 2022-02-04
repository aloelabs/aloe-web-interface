import React from 'react';
import styled from 'styled-components';

const BlobContainer = styled.div`
  pointer-events: none;
  z-index: 0;
  position: absolute;
  height: 240px;
  width: 530px;
  top: 6rem;
  left: 50%;
  transform: translate(-50%, 0%);
`;

const Blob = styled.div`
  position: absolute;
  border-radius: 50%;
  //   background: linear-gradient(100.12deg, rgba(192, 143, 255, 1.0) -34.33%, rgba(108, 207, 228, 1.0) 60.51%, rgba(136, 226, 161, 1.0) 117.32%);
  background: linear-gradient(
    100.12deg,
    rgba(108, 207, 228, 1) 30.51%,
    rgba(136, 226, 161, 1) 117.32%
  );
  //   background: #2F485A;

  @keyframes float {
    0% {
      transform: rotateX(0deg) translateY(0px);
    }

    50% {
      transform: rotateX(0deg) translateY(10px) translateX(5px);
    }
    100% {
      transform: rotateX(0deg) translateY(0px) translateX(0px);
    }
  }
`;

const Blob1 = styled(Blob)`
  --diameter: 12vh;

  height: var(--diameter);
  width: var(--diameter);
  bottom: -0.5rem;
  left: -2rem;

  opacity: 0.8;
  animation-timing-function: cubic-bezier(0.54, 0.085, 0.5, 0.92);
  animation-iteration-count: infinite;
  animation-name: float;
  animation-duration: 6s;
  animation-delay: 3.5s;
  animation-direction: alternate;
`;

const Blob2 = styled(Blob)`
  --diameter: 8vh;

  height: var(--diameter);
  width: var(--diameter);
  top: 25%;
  right: -1rem;

  opacity: 0.8;
  animation-timing-function: cubic-bezier(0.54, 0.085, 0.5, 0.92);
  animation-iteration-count: infinite;
  animation-name: float;
  -webkit-animation-name: float;
  animation-duration: 6s;
  -webkit-animation-duration: 6s;
  -webkit-animation-delay: 2s;
  animation-delay: 2s;
  animation-direction: alternate;
`;

export default function BackgroundBlobs() {
  return (
    <BlobContainer>
      <Blob1 />
      <Blob2 />
    </BlobContainer>
  );
}
