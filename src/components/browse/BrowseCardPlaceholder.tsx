import styled from 'styled-components';
import tw from 'twin.macro';
import {
  BROWSE_CARD_WIDTH_LG,
  BROWSE_CARD_WIDTH_MD,
  BROWSE_CARD_WIDTH_XL,
  RESPONSIVE_BREAKPOINT_LG,
  RESPONSIVE_BREAKPOINT_MD,
} from '../../data/constants/Breakpoints';

const BROWSE_CARD_PLACEHOLDER_HEIGHT_LG = '331px';
const BROWSE_CARD_PLACEHOLDER_HEIGHT_MD = '475px';

export const BrowseCardPlaceholder = styled.div`
  ${tw`flex flex-col items-start justify-evenly`}
  width: ${BROWSE_CARD_WIDTH_XL};
  height: ${BROWSE_CARD_PLACEHOLDER_HEIGHT_LG};
  background: #0d171e;
  background-image: linear-gradient(
    to right,
    #0d171e 0%,
    #131f28 20%,
    #0d171e 40%,
    #0d171e 100%
  );
  background-repeat: no-repeat;
  background-size: ${BROWSE_CARD_WIDTH_XL} ${BROWSE_CARD_PLACEHOLDER_HEIGHT_LG};
  display: inline-block;
  animation: browseCardShimmer 1s forwards linear infinite;
  border-radius: 8px;
  overflow: hidden;
  position: relative;

  @keyframes browseCardShimmer {
    0% {
      background-position: -${BROWSE_CARD_WIDTH_XL} 0;
    }
    100% {
      background-position: ${BROWSE_CARD_WIDTH_XL} 0;
    }
  }
  @media (max-width: ${RESPONSIVE_BREAKPOINT_LG}) {
    width: ${BROWSE_CARD_WIDTH_LG};
    height: ${BROWSE_CARD_PLACEHOLDER_HEIGHT_LG};
    background-size: ${BROWSE_CARD_WIDTH_LG} ${BROWSE_CARD_PLACEHOLDER_HEIGHT_MD};

    @keyframes browseCardShimmer {
      0% {
        background-position: -${BROWSE_CARD_WIDTH_LG} 0;
      }
      100% {
        background-position: ${BROWSE_CARD_WIDTH_LG} 0;
      }
    }
  }
  @media (max-width: ${RESPONSIVE_BREAKPOINT_MD}) {
    width: ${BROWSE_CARD_WIDTH_MD};
    height: ${BROWSE_CARD_PLACEHOLDER_HEIGHT_MD};
    background-size: ${BROWSE_CARD_WIDTH_MD} height: ${BROWSE_CARD_PLACEHOLDER_HEIGHT_MD};
    margin: 0 auto;

    @keyframes browseCardShimmer {
      0% {
        background-position: -${BROWSE_CARD_WIDTH_MD} 0;
      }
      100% {
        background-position: ${BROWSE_CARD_WIDTH_MD} 0;
      }
    }
  }
`;
