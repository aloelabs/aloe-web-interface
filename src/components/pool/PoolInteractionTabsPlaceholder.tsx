import styled from "styled-components";
import { RESPONSIVE_BREAKPOINT_MD, RESPONSIVE_BREAKPOINT_SM } from "../../data/constants/Breakpoints";

export const PoolInteractionTabsPlaceholder = styled.div`
  width: 100%;
  height: 515px;
  border-radius: 8px;
  background: #0d171e;
  background-image: linear-gradient(
    to right,
    #0d171e 0%,
    #131f28 20%,
    #0d171e 40%,
    #0d171e 100%
  );
  background-repeat: no-repeat;
  background-size: 500px 515px;
  display: inline-block;
  animation: shimmerPoolInteractionTabs 1s forwards linear infinite;

  @keyframes shimmerPoolInteractionTabs {
    0% {
      background-position: -500px 0;
    }
    100% {
      background-position: 500px 0;
    }
  }

  @media (max-width: ${RESPONSIVE_BREAKPOINT_MD}) {
    width: 100%;
    height: 497.6px;
    background-size: 1055.2px 497.6px;

    @keyframes shimmerPoolInteractionTabs {
      0% {
        background-position: -1055.2px 0;
      }
      100% {
        background-position: 1055.2px 0;
      }
    }
  }

  @media (max-width: ${RESPONSIVE_BREAKPOINT_SM}) {
    width: 100%;
    height: 497.6px;
    background-size: 704px 497.6px;

    @keyframes shimmerPoolInteractionTabs {
      0% {
        background-position: -100vw 0;
      }
      100% {
        background-position: 100vw 0;
      }
    }
  }

`;