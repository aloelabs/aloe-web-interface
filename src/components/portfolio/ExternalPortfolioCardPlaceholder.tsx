import styled from 'styled-components';
import tw from 'twin.macro';
import {
  RESPONSIVE_BREAKPOINT_MD,
  RESPONSIVE_BREAKPOINT_SM,
} from '../../data/constants/Breakpoints';

export const ExternalPortfolioCardPlaceholder = styled.div`
${tw`flex flex-col items-start justify-evenly`}
  width: 100%;
  height: 150px;
  background: #0d171e;
  background-image: linear-gradient(
    to right,
    #0d171e 0%,
    #131f28 20%,
    #0d171e 40%,
    #0d171e 100%
  );
  background-repeat: no-repeat;
  background-size: 100% 150px;
  display: inline-block;
  animation: externalPortfolioCardShimmer 1s forwards linear infinite;
  border-radius: 8px;
  overflow: hidden;
  position: relative;

  @keyframes externalPortfolioCardShimmer {
    0% {
      background-position: -1200px 0;
    }
    100% {
      background-position: 1200px 0;
    }
  }

  @media (max-width: ${RESPONSIVE_BREAKPOINT_MD}) {
    width: 100%;
    height: 262px;
    background-size: 100% 262px;

    @keyframes externalPortfolioCardShimmer {
      0% {
        background-position: -1040px 0;
      }
      100% {
        background-position: 1040px 0;
      }
    }
  }

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    width: 100%;
    height: 406.3px;
    background-size: 100% 406.3px;

    @keyframes externalPortfolioCardShimmer {
      0% {
        background-position: -720px 0;
      }
      100% {
        background-position: 720px 0;
      }
    }
  }
`;