import styled from 'styled-components';
import tw from 'twin.macro';
import { RESPONSIVE_BREAKPOINT_SM, RESPONSIVE_BREAKPOINT_XS } from '../../data/constants/Breakpoints';

export const BlendGraphPlaceholder = styled.div`
  ${tw`flex flex-col items-start justify-evenly`}
  width: calc(100% + 64px);
  height: 300px;
  background: #0d171e;
  background-image: linear-gradient(
    to right,
    #0d171e 0%,
    #131f28 20%,
    #0d171e 40%,
    #0d171e 100%
  );
  background-repeat: no-repeat;
  background-size: 900px 300px;
  display: inline-block;
  animation: blendGraphShimmer 1s forwards linear infinite;
  overflow: hidden;
  position: relative;
  left: -32px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    left: -16px;
    width: calc(100% + 32px);
  }

  @media (max-width: ${RESPONSIVE_BREAKPOINT_XS}) {
    left: 0;
    /* 31px in order to avoid overflow in case of decimals */
    // NOTE: this value is 100% plus 2 * the padding of the pool page minus 1 to fill the entire space
    width: calc(100% + 31px);
  }
  @keyframes blendGraphShimmer {
    0% {
      background-position: -900px 0;
    }
    100% {
      background-position: 900px 0;
    }
  }
`;
