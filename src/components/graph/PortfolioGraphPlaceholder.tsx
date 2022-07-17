import styled from 'styled-components';
import tw from 'twin.macro';
import {
  RESPONSIVE_BREAKPOINT_MD,
  RESPONSIVE_BREAKPOINT_SM,
  RESPONSIVE_BREAKPOINT_XS,
} from '../../data/constants/Breakpoints';

export const PortfolioGraphPlaceholder = styled.div`
  ${tw`flex flex-col items-start justify-evenly`}
  width: 100%;
  height: 225.5px;
  background: #0d171e;
  background-image: linear-gradient(
    to right,
    #0d171e 0%,
    #131f28 20%,
    #0d171e 40%,
    #0d171e 100%
  );
  background-repeat: no-repeat;
  background-size: 100% 222.5px;
  display: inline-block;
  animation: portfolioGraphShimmer 1s forwards linear infinite;
  overflow: hidden;
  position: relative;

  @keyframes portfolioGraphShimmer {
    0% {
      background-position: -1400px 0;
    }
    100% {
      background-position: 1400px 0;
    }
  }

  @media (max-width: ${RESPONSIVE_BREAKPOINT_MD}) {
    @keyframes portfolioGraphShimmer {
      0% {
        background-position: -1200px 0;
      }
      100% {
        background-position: 1200px 0;
      }
    }
  }

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    @keyframes portfolioGraphShimmer {
      0% {
        background-position: -768px 0;
      }
      100% {
        background-position: 768px 0;
      }
    }
  }

  @media (max-width: ${RESPONSIVE_BREAKPOINT_XS}) {
    @keyframes portfolioGraphShimmer {
      0% {
        background-position: -480px 0;
      }
      100% {
        background-position: 480px 0;
      }
    }
  }
`;
